import {
  BookMarkedIcon,
  GitGraphIcon,
  MessageCircleDashedIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const LINKS = [
  {
    id: "knowledge-graph",
    Icon: GitGraphIcon,
    label: "Collection Graph",
    tooltip: "knowledge graph.",
  },
  {
    id: "docs",
    Icon: BookMarkedIcon,
    label: "Documents",
    tooltip: "Documents",
  },
  {
    id: "chats",
    Icon: MessageCircleDashedIcon,
    label: "Chats",
    tooltip: "Chats.",
  },
];

function CollectionInfo() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collections.</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {LINKS.map(({ id, Icon, label, tooltip }) => (
            <SidebarMenuItem key={id}>
              <SidebarMenuButton tooltip={tooltip}>
                <Icon />
                {label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export default CollectionInfo;
