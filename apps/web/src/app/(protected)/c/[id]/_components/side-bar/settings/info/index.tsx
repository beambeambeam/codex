import { useCollectionState } from "@/app/(protected)/c/[id]/_components/context";
import CollectionUpdateForm from "@/app/(protected)/c/[id]/_components/side-bar/settings/info/form";

function CollectionInfo() {
  const { collection } = useCollectionState();
  return (
    <div className="p-4">
      <CollectionUpdateForm
        defaultValues={{
          title: collection.title ?? "",
          description: collection.description ?? "",
        }}
      />
    </div>
  );
}
export default CollectionInfo;
