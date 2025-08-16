import { BadgeAlertIcon } from "lucide-react";

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
            <div className="rounded-lg border-2 p-1 px-3 text-sm">
              {collection.description
                ? collection.description
                : "No description yet"}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export default CollectionInfo;
