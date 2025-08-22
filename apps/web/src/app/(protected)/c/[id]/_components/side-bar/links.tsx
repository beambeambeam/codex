import { useParams, usePathname, useRouter } from "next/navigation";
import {
  BookAlertIcon,
  BookIcon,
  BookMarkedIcon,
  BookTextIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const LINKS = [
  {
    id: "home",
    Icon: BookIcon,
    label: "Home",
    tooltip: "Home",
    href: "/",
    pattern: "/*",
  },
  {
    id: "docs",
    Icon: BookMarkedIcon,
    label: "Documents",
    tooltip: "Documents",
    pattern: "/docs/*",
    href: "/docs",
  },
  {
    id: "chats",
    Icon: BookTextIcon,
    label: "Chats",
    tooltip: "Chats.",
    pattern: "/chats/*",
    href: "/chats",
  },
];

function CollectionLinks() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pathname = usePathname() ?? "";

  const collectionBase = `/c/${params.id}`;
  const relativePath = pathname.startsWith(collectionBase)
    ? pathname.slice(collectionBase.length) || "/"
    : pathname;

  // Build info for each link: base (pattern without /*) and whether it matches
  const linkInfos = LINKS.map((link) => {
    const pattern = link.pattern;
    const base = pattern
      ? pattern.endsWith("/*")
        ? pattern.slice(0, -2)
        : pattern
      : undefined;
    const matched = pattern
      ? pattern.endsWith("/*")
        ? relativePath.startsWith(base ?? "")
        : relativePath === base
      : false;
    return { ...link, base, matched };
  });

  // Prefer the most specific (longest) matching base. This prevents a catch-all like "/*" from shadowing specific routes.
  const bestMatch = linkInfos
    .filter((l) => l.matched)
    .sort((a, b) => (b.base?.length ?? 0) - (a.base?.length ?? 0))[0];
  const activeId = bestMatch?.id;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex gap-0.5">
        <BookMarkedIcon /> Links.
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {LINKS.map(({ id, Icon, label, tooltip, href }) => {
            const isActive = id === activeId;
            return (
              <SidebarMenuItem key={id}>
                <SidebarMenuButton
                  tooltip={tooltip}
                  className={cn(
                    isActive &&
                      "bg-sidebar-accent hover:bg-sidebar-accent-foreground/20",
                  )}
                  onClick={() =>
                    href && router.push(`${collectionBase}${href}`)
                  }
                >
                  <Icon />
                  {label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          <SidebarMenuItem key="settings">
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => router.push("?collection=settings")}
            >
              <BookAlertIcon />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export default CollectionLinks;
