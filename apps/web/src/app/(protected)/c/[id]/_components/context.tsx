import React from "react";
import type { ReactNode } from "react";
import { createStore, useStore } from "zustand";
import type { StoreApi } from "zustand";

import { components } from "@/lib/api/path";

type CollectionState = components["schemas"]["CollectionResponse"];

interface CollectionActions {
  setCollection: (
    collection: components["schemas"]["CollectionResponse"],
  ) => void;
}

type CollectionStore = CollectionState & { actions: CollectionActions };

const CollectionStoreContext =
  React.createContext<StoreApi<CollectionStore> | null>(null);

interface CollectionStoreProviderProps {
  children: ReactNode;
  initial: CollectionState;
}

export const CollectionStoreProvider = ({
  children,
  initial,
}: CollectionStoreProviderProps) => {
  const [store] = React.useState<StoreApi<CollectionStore>>(() =>
    createStore<CollectionStore>((set) => ({
      ...initial,
      actions: {
        setCollection: (collection) => set({ ...collection }),
      },
    })),
  );
  return (
    <CollectionStoreContext.Provider value={store}>
      {children}
    </CollectionStoreContext.Provider>
  );
};

export const useCollectionStore = <T,>(
  selector: (s: CollectionStore) => T,
): T => {
  const store = React.useContext(CollectionStoreContext);
  if (!store) {
    throw new Error("Missing CollectionStoreProvider");
  }
  return useStore(store, selector);
};

export const useCollectionState = () => {
  const storeState = useCollectionStore((s) => s);

  return React.useMemo(() => {
    const { actions: _actions, ...rest } = storeState;
    void _actions;
    return { collection: rest };
  }, [storeState]);
};

export const useCollectionActions = () => useCollectionStore((s) => s.actions);
