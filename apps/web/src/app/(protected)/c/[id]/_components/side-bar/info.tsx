import { BadgeAlertIcon, NotebookPenIcon } from "lucide-react";

import { useCollectionState } from "@/app/(protected)/c/[id]/_components/context";
import { Badge } from "@/components/ui/badge";
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
        <Badge>
          <BadgeAlertIcon />
          Description
        </Badge>
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="px-2">
            <div className="text-wrap font-sans text-sm">
              {collection.description ? (
                collection.description
              ) : (
                <span className="text-muted-foreground">
                  No description yet.
                </span>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <SidebarGroupLabel className="mt-3 flex items-center gap-0.5">
        <Badge>
          <NotebookPenIcon />
          Summary
        </Badge>
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="px-2">
            <div className="text-wrap font-sans text-sm">
              {collection.summary ? (
                collection.summary
              ) : (
                <span className="text-muted-foreground">No summary yet.</span>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export default CollectionInfo;
