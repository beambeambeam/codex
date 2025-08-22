"use client";

import { AlbumIcon, PlusIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import CreateNewCollectionForm from "@/app/(protected)/home/_components/create/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CreateCollectionDialog() {
  const [open, setOpen] = useQueryState(
    "collection",
    parseAsString.withDefault(""),
  );

  return (
    <Dialog
      open={open === "create"}
      onOpenChange={(isOpen) => setOpen(isOpen ? "create" : "")}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-full min-w-[27rem] max-w-full"
        showCloseButton={false}
      >
        <DialogHeader className="pb-6 pt-2">
          <DialogTitle className="flex items-center gap-2">
            <AlbumIcon />
            <span>New Collection</span>
          </DialogTitle>
          <DialogDescription className="pb-4">
            Create a personal collection for the title you&apos;re interested
            in, Or this leave all blank.
          </DialogDescription>
          <CreateNewCollectionForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default CreateCollectionDialog;
