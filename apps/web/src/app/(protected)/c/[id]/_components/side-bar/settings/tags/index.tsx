"use client";

import React from "react";
import { PlusIcon, TagIcon } from "lucide-react";

import TagForm from "@/app/(protected)/c/[id]/_components/side-bar/settings/tags/form";
import TagList from "@/app/(protected)/c/[id]/_components/side-bar/settings/tags/list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function CollectionTag() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TagIcon className="h-4 w-4" />
          <h3 className="text-sm font-medium">Tags</h3>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <PlusIcon className="mr-1 h-3 w-3" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <TagForm
              defaultValues={{
                color: "",
                title: "",
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          Existing Tags
        </h4>
        <TagList />
      </div>
    </div>
  );
}

export default CollectionTag;
