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

    if (Array.isArray(value)) {
      if (value.every((item) => item instanceof File)) {
        value.forEach((file) =>
          formData.append(key, file, encodeURIComponent(file.name)),
        );
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
