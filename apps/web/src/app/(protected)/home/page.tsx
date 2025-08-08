"use client";

import SignOutButton from "@/components/sign-out";
import { useUser } from "@/store/user";

function HomePage() {
  const { user } = useUser();

  return (
    <div>
      {user?.display} <SignOutButton />
    </div>
  );
}

export default HomePage;
