"use client";

import { LibraryBigIcon, StarIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import CollectionBooks from "@/app/(protected)/home/_components/book";
import HomeCanvas from "@/app/(protected)/home/_components/canvas";
import CreateCollectionDialog from "@/app/(protected)/home/_components/create";
import HomeSearch from "@/app/(protected)/home/_components/search";
import Settings from "@/components/settings";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleThemeButton } from "@/components/ui/toggle-theme";
import { useUser } from "@/store/user";

function HomePage() {
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("g"));

  const onTabChange = (value: string) => setTab(value);
  const { user } = useUser();

  return (
    <div className="flex h-screen w-full flex-col space-y-1 p-4">
      <div className="flex w-full justify-between">
        <div className="text-xl font-bold">Welcome back, {user?.display}.</div>
        <div className="flex gap-2">
          <HomeSearch />
          <CreateCollectionDialog />
          <ToggleThemeButton />
          <Settings />
        </div>
      </div>
      <div className="relative h-full overflow-hidden rounded-lg border-2">
        <Tabs
          defaultValue="g"
          className="absolute z-50 w-full lg:left-4 lg:top-4"
          value={tab}
          orientation="vertical"
          onValueChange={onTabChange}
        >
          <TabsList className="h-full flex-col">
            <TabsTrigger value="g">
              <StarIcon />
              Webs
            </TabsTrigger>
            <TabsTrigger value="b">
              <LibraryBigIcon />
              Books
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div
          style={{ display: tab === "g" ? "block" : "none" }}
          className="h-full w-full"
        >
          <HomeCanvas display={user?.display ?? ""} />
        </div>
        <div
          className="h-full w-full"
          style={{ display: tab === "b" ? "block" : "none" }}
        >
          <CollectionBooks />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
