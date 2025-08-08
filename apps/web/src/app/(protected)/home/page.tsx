"use client";

import Settings from "@/components/settings";
import SignOutButton from "@/components/sign-out";
import { useUser } from "@/store/user";

function HomePage() {
  const { user } = useUser();

  return (
    <div>
      <Settings />
      {user?.display} <SignOutButton />
    </div>
  );
}

export default HomePage;
