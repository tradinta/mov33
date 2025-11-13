
'use client';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CommandDialog, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { mockSearchData } from "@/lib/search-data";
import { Separator } from '../ui/separator';

export function EventSearch() {
  const [openCommand, setOpenCommand] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommand((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="relative w-full" onClick={() => setOpenCommand(true)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search events, artists, venues..."
          className="pl-10 h-12 rounded-lg cursor-pointer w-full text-base"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-sm font-medium opacity-100 sm:flex">
          <span className="text-lg">⌘</span>K
        </kbd>
      </div>
      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput placeholder="Search events, artists, venues..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Events">
            {mockSearchData.events.map((event) => (
              <CommandItem key={event.id} value={event.name} onSelect={() => { console.log('nav to event'); setOpenCommand(false); }}>
                {event.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <Separator />
          <CommandGroup heading="Artists">
            {mockSearchData.artists.map((artist) => (
              <CommandItem key={artist.id} value={artist.name} onSelect={() => { console.log('nav to artist'); setOpenCommand(false); }}>
                {artist.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <Separator />
          <CommandGroup heading="Venues">
            {mockSearchData.venues.map((venue) => (
              <CommandItem key={venue.id} value={venue.name} onSelect={() => { console.log('nav to venue'); setOpenCommand(false); }}>
                {venue.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
