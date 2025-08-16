"use client";

import { SquarePenIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryFetchClient } from "@/lib/api/client";

function HomeSearch() {
  const [query, setQuery] = useQueryState(
    "collection",
    parseAsString.withDefault(""),
  );

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const { data, isPending } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/collections/search",
    {
      params: {
        query: {
          word: search,
          per_page: 5,
        },
      },
    },
    {
      retry: 0,
    },
  );

  return (
    <>
      <Input
        placeholder="Search Collections."
        onClick={() => setQuery("search")}
      />
      <CommandDialog
        open={query === "search"}
        onOpenChange={(value) => setQuery(value ? "search" : "")}
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty className="flex flex-col gap-2 px-4 py-6">
            {isPending ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : (
              "No collection found."
            )}
          </CommandEmpty>
          {!isPending && (
            <>
              {data && (
                <>
                  <CommandGroup heading="Collection Suggestions">
                    {data.map((collection) => (
                      <CommandItem key={collection.id}>
                        {collection.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading="Command Suggestions">
                    <CommandItem>
                      <SquarePenIcon />
                      New Collection
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
export default HomeSearch;
