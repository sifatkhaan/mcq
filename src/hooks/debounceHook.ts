import { useEffect, useState } from "react";
interface UseDebouncedProps {
  searchQuery: string;
  delay?: number;
}
export default function useDebounced({
  searchQuery,
  delay = 600,
}: UseDebouncedProps) {
  const [debouncedValue, setDebouncedValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchQuery);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, delay]);

  return debouncedValue;
}
