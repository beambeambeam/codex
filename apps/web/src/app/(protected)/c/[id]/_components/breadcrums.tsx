"use client";

import { useParams, usePathname } from "next/navigation";
import { BookMarkedIcon } from "lucide-react";

import { useCollectionState } from "@/app/(protected)/c/[id]/_components/context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TABS = [
  {
    label: "Documents",
    pattern: "/docs/*",
    icon: BookMarkedIcon,
  },
];

function CollectionBreadcrums() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname() ?? "";
  const { collection } = useCollectionState();

  const matchesPattern = (path: string, pattern: string) => {
    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2);
      return path.startsWith(base);
    }
    return path === pattern;
  };

  const collectionBase = `/c/${params.id}`;
  const relativePath = pathname.startsWith(collectionBase)
    ? pathname.slice(collectionBase.length) || "/"
    : pathname;

  const selectedIndex = TABS.findIndex((tab) =>
    matchesPattern(relativePath, tab.pattern),
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/c/${params.id}`}>
            {collection.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {selectedIndex !== -1 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Select defaultValue={String(selectedIndex)}>
                <SelectTrigger className="border-0 shadow-none">
                  <SelectValue placeholder="Select database" />
                </SelectTrigger>
                <SelectContent>
                  {TABS.map((tab, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      <tab.icon className="size-4" />
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default CollectionBreadcrums;
