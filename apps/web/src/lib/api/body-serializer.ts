export function JsonToFormData(body: {
  [key: string]:
    | string
    | Blob
    | object
    | boolean
    | File
    | File[]
    | number
    | null;
}) {
  const formData = new FormData();
  for (const key in body) {
    const value = body[key];

    if (value === null || value === undefined) {
      continue;
    }

    // Special handling for items array to match the new API structure
    if (key === "items" && Array.isArray(value)) {
      const files: File[] = [];
      const titles: string[] = [];
      const descriptions: string[] = [];

      value.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          for (const nestedKey in item) {
            const nestedValue = item[nestedKey];
            if (nestedKey === "file" && nestedValue instanceof File) {
              files.push(nestedValue);
            } else if (
              nestedKey === "title" &&
              typeof nestedValue === "string"
            ) {
              titles.push(nestedValue);
            } else if (
              nestedKey === "description" &&
              typeof nestedValue === "string"
            ) {
              descriptions.push(nestedValue);
            }
          }
        }
      });

      // Add files array
      files.forEach((file) => {
        formData.append("files", file, encodeURIComponent(file.name));
      });

      // Add titles array
      titles.forEach((title) => {
        formData.append("titles", title);
      });

      // Add descriptions array
      descriptions.forEach((description) => {
        formData.append("descriptions", description);
      });

      continue;
    }

    if (Array.isArray(value)) {
      if (value.every((item) => item instanceof File)) {
        value.forEach((file) =>
          formData.append(key, file, encodeURIComponent(file.name)),
        );
      } else {
        // For other arrays, create indexed form fields
        value.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            for (const nestedKey in item) {
              const nestedValue = item[nestedKey];
              if (nestedValue instanceof File) {
                formData.append(
                  `${key}.${index}.${nestedKey}`,
                  nestedValue,
                  encodeURIComponent(nestedValue.name),
                );
              } else if (nestedValue !== null && nestedValue !== undefined) {
                formData.append(
                  `${key}.${index}.${nestedKey}`,
                  String(nestedValue),
                );
              }
            }
          } else if (item !== null && item !== undefined) {
            formData.append(`${key}.${index}`, String(item));
          }
        });
      }
      continue;
    }

    if (value instanceof File) {
      formData.append(key, value, encodeURIComponent(value.name));
      continue;
    }

    if (value instanceof Blob) {
      formData.append(key, value);
      continue;
    }

    if (typeof value === "boolean") {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    if (typeof value === "number") {
      formData.append(key, value.toString());
      continue;
    }

    if (typeof value === "string") {
      formData.append(key, value);
      continue;
    }

    // Handle remaining objects
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    }
  }

  return formData;
}
