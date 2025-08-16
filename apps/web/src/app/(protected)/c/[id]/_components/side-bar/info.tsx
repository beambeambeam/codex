import { BadgeAlertIcon, NotebookPenIcon } from "lucide-react";

import { useCollectionState } from "@/app/(protected)/c/[id]/_components/context";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function CollectionInfo() {
  const { collection } = useCollectionState();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center gap-0.5">
        <BadgeAlertIcon />
        Description
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="px-2">
            <div className="text-wrap text-xs">
              {collection.description
                ? collection.description
                : "No description yet."}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <SidebarGroupLabel className="mt-3 flex items-center gap-0.5">
        <NotebookPenIcon />
        Summary
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="px-2">
            <div className="text-wrap text-xs">
              {collection.summary ? collection.summary : "No summary yet."}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export default CollectionInfo;
