export default interface FormProps<SchemaType> {
  defaultValues?: SchemaType;
  disabled?: boolean;
}

export interface ExternalFormProps<SchemaType> {
  defaultValues?: SchemaType;
  disabled?: boolean;
  isPending?: boolean;
  isError?: boolean;
}
