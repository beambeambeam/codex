"use client";

import { ArchiveIcon, TagIcon, UsersIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import CollectionInfo from "@/app/(protected)/c/[id]/_components/side-bar/settings/info";
import CollectionTag from "@/app/(protected)/c/[id]/_components/side-bar/settings/tags";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CollectionSettings() {
  const [open, setOpen] = useQueryState(
    "collection",
    parseAsString.withDefault(""),
  );

  const [tab, setTab] = useQueryState(
    "settings-tab",
    parseAsString.withDefault("project"),
  );
  const onTabChange = (value: string) => setTab(value);

  const TABS_TRIGGER_CLASSNAME =
    "hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary hover:after:bg-accent data-[state=active]:hover:bg-accent relative w-full justify-start rounded-none border-none py-6 after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none";

  return (
    <Dialog
      open={open === "settings"}
      onOpenChange={(isOpen) => {
        setTab(null);
        setOpen(isOpen ? "settings" : "");
      }}
    >
      <DialogContent className="md:min-w-4xl max-w-full p-0">
        <DialogHeader className="p-0 px-6 pt-5">
          <DialogTitle>Collection&apos;s Settings</DialogTitle>
          <DialogDescription hidden>
            This is dialog for settings change for overall
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto border-t-2">
          <Tabs
            defaultValue="project"
            orientation="vertical"
            className="h-[70vh] w-full flex-row !gap-0"
            value={tab}
            onValueChange={onTabChange}
          >
            <TabsList className="text-foreground flex-col items-start justify-start gap-1 rounded-none bg-transparent py-0 !pr-0">
              <TabsTrigger value="project" className={TABS_TRIGGER_CLASSNAME}>
                <ArchiveIcon
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Collection
              </TabsTrigger>
              <TabsTrigger
                value="contributor"
                className={TABS_TRIGGER_CLASSNAME}
              >
                <UsersIcon
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Contributor
              </TabsTrigger>
              <TabsTrigger value="tags" className={TABS_TRIGGER_CLASSNAME}>
                <TagIcon
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Tags
              </TabsTrigger>
            </TabsList>
            <Separator orientation="vertical" />
            <TabsContent value="project" className="p-2">
              <CollectionInfo />
            </TabsContent>
            <TabsContent value="contributor" className="p-2"></TabsContent>
            <TabsContent value="tags" className="p-2">
              <CollectionTag />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default CollectionSettings;
