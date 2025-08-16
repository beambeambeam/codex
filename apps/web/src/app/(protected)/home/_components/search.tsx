"use client";

import { AlbumIcon, SquarePenIcon } from "lucide-react";
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
import { useDebouncedSearch } from "@/lib/hooks/useDebouncedSearch";

function HomeSearch() {
  const [open, setOpen] = useQueryState(
    "collection",
    parseAsString.withDefault(""),
  );

  const { inputValue, localInputValue, handleInputChange, isSearching } =
    useDebouncedSearch();

  const { data, isPending, isError } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/collections/search",
    {
      params: {
        query: {
          word: inputValue,
          per_page: 4,
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
        onClick={() => setOpen("search")}
      />
      <CommandDialog
        open={open === "search"}
        onOpenChange={(isOpen) => setOpen(isOpen ? "search" : "")}
        shouldFilter={false}
        className="h-fit"
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={localInputValue}
          onValueChange={handleInputChange}
        />
        <CommandList className="h-fit">
          <CommandEmpty className="flex flex-col gap-2 px-4 py-6">
            {isError ? (
              "error something went wrong"
            ) : isPending || isSearching ? (
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
                    {data.length === 0 ? (
                      <CommandItem disabled>No collection found.</CommandItem>
                    ) : (
                      data.map((collection) => (
                        <CommandItem key={collection.id}>
                          <AlbumIcon />
                          {collection.title}
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                  <CommandGroup heading="Command Suggestions">
                    <CommandItem onSelect={() => setOpen("create")}>
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
