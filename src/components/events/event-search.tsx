
'use client';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EventSearchProps {
  onSearch?: (query: string) => void;
}

export function EventSearch({ onSearch }: EventSearchProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder="Search events, artists, venues..."
        className="pl-11 h-14 rounded-2xl bg-white/5 border-white/10 font-bold font-poppins text-white placeholder:text-white/20 focus-visible:ring-gold/50 transition-all w-full text-base shadow-2xl"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
}
