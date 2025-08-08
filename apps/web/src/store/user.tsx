"use client";

import React, { createContext, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import { components } from "@/lib/api/path";

type UserState = components["schemas"]["UserLoginResponse"];

interface UserStore {
  user: UserState | null;
  setUser: (user: UserState) => void;
  reset: () => void;
}

const UserStoreContext = createContext<StoreApi<UserStore> | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
  initialUser?: UserState | null;
}

export const UserProvider = ({
  children,
  initialUser = null,
}: UserProviderProps) => {
  const [store] = useState(() =>
    createStore<UserStore>()(
      persist(
        (set) => ({
          user: initialUser,
          setUser: (user) => set({ user }),
          reset: () => set({ user: null }),
        }),
        {
          name: "user-storage",
          partialize: (state) => ({ user: state.user }),
        },
      ),
    ),
  );

  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (state: UserStore) => T): T => {
  const store = useContext(UserStoreContext);
  if (!store) {
    throw new Error("Missing UserProvider");
  }
  return useStore(store, selector);
};

export const useUser = () => {
  const store = useContext(UserStoreContext);
  if (!store) {
    throw new Error("Missing UserProvider");
  }
  return useStore(
    store,
    useShallow((state) => ({
      user: state.user,
    })),
  );
};

export const useUserActions = () => {
  const store = useContext(UserStoreContext);
  if (!store) {
    throw new Error("Missing UserProvider");
  }
  return useStore(
    store,
    useShallow((state) => ({
      setUser: state.setUser,
      reset: state.reset,
    })),
  );
};
