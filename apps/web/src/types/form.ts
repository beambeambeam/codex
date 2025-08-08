export interface FormProps<SchemaType> {
  defaultValues?: SchemaType;
  onSubmit?: (values: SchemaType) => void;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  disabled?: boolean;
}
