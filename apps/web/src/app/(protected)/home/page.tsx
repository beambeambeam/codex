"use client";

import HomeCanvas from "@/app/(protected)/home/_components/canvas";
import HomeSearch from "@/app/(protected)/home/_components/search";
import Settings from "@/components/settings";
import { useUser } from "@/store/user";

function HomePage() {
  const { user } = useUser();

  return (
    <div className="flex h-screen w-full flex-col space-y-1 p-4">
      <div className="flex w-full justify-between">
        <div className="text-xl font-bold">Welcome back, {user?.display}.</div>
        <div className="flex gap-2">
          <HomeSearch />
          <Settings />
        </div>
      </div>
      <div className="h-full rounded-lg border-2">
        <HomeCanvas display={user?.display ?? ""} />
      </div>
    </div>
  );
}

export default HomePage;
