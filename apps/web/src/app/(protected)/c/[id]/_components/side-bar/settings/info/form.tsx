import z from "zod";

const collectionUpdateFormSchema = z.object({
  title: z.string(),
  description: z.string(),
});

function CollectionUpdateForm() {
  return <div>CollectionUpdate</div>;
}
export default CollectionUpdateForm;
