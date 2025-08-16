import { useId, useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

export function useDebouncedSearch() {
  const id = useId();

  const [inputValue, setInputValue] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const [localInputValue, setLocalInputValue] = useState(inputValue || "");
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setInputValue(value);
    setIsSearching(false);
  }, 300);

  const handleInputChange = (value: string) => {
    setLocalInputValue(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  return {
    id,
    inputValue,
    setInputValue,
    localInputValue,
    setLocalInputValue,
    isSearching,
    setIsSearching,
    handleInputChange,
  };
}
