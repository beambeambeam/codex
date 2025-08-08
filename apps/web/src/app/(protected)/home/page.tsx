"use client";

import { useUser } from "@/store/user";

function HomePage() {
  const { user } = useUser();

  return <div>{user?.display}</div>;
}

export default HomePage;
