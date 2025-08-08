export default interface FormProps<SchemaType> {
  defaultValues?: SchemaType;
  onSubmit?: (values: SchemaType) => void;
  disabled?: boolean;
}
