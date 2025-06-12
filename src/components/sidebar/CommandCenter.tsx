import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { useSidebar } from "~/components/ui/sidebar";

function CommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useSidebar();

  // Listen for keydown event to open Command
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {state === "collapsed" ? (
        <div className="w-full py-2 flex items-center justify-center">
          <Search size={14} />
        </div>
      ) : (
        <div
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="w-full py-2 px-4 border-1 bg-slate-900 rounded-sm flex justify-between items-center cursor-pointer"
        >
          <Search size={14} />
          <span className="flex gap-2 items-center">
            {/* <p className="text-sm text-muted-foreground">Press</p> */}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </span>
        </div>
      )}
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Schedule">
            <CommandItem>Calander</CommandItem>
            <CommandItem>Upcoming</CommandItem>
            <CommandItem>Past</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Bidding"></CommandGroup>
          <CommandGroup heading="Bills"></CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandCenter;
