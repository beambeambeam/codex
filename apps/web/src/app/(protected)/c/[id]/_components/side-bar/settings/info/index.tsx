import { AlbumIcon } from "lucide-react";

import { useCollectionState } from "@/app/(protected)/c/[id]/_components/context";
import CollectionDelete from "@/app/(protected)/c/[id]/_components/side-bar/settings/info/delete";
import CollectionUpdateForm from "@/app/(protected)/c/[id]/_components/side-bar/settings/info/form";

function CollectionInfo() {
  const { collection } = useCollectionState();
  return (
    <div className="flex flex-col gap-3 p-4">
      <h1 className="flex items-start justify-start gap-1 text-lg font-bold">
        <AlbumIcon />
        Collection
      </h1>
      <CollectionUpdateForm
        defaultValues={{
          title: collection.title ?? "",
          description: collection.description ?? "",
        }}
      />
      <h1 className="text-destructive text-lg font-bold">Danger Zone.</h1>
      <div className="bg-destructive/10 flex flex-col rounded-lg border-2 border-dashed p-2">
        <div className="flex w-full items-center gap-2">
          <CollectionDelete />
          <p className="text-destructive text-sm">
            This action cannot be undone. Deleting the collection will
            permanently remove all its data.
          </p>
        </div>
      </div>
    </div>
  );
}
export default CollectionInfo;
