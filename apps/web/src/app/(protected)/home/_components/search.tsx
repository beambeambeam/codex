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

function HomeSearch() {
  const [query, setQuery] = useQueryState(
    "collection",
    parseAsString.withDefault(""),
  );

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
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
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No collection found.</CommandEmpty>
          <CommandGroup heading="Collection Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Command Suggestions">
            <CommandItem>
              <SquarePenIcon />
              New Collection
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
export default HomeSearch;
