import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { usePage } from "@inertiajs/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Brand {
  id: number
  name: string
  slug: string
}

interface BrandSelectProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function BrandSelect({ value, onChange, error }: BrandSelectProps) {
  const [open, setOpen] = React.useState(false)
  const { brands = [] } = usePage().props as unknown as { brands: Brand[] }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-14 w-full justify-between bg-luxury-charcoal border-white/5 text-white hover:bg-luxury-charcoal hover:text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none font-medium px-4",
            !value && "text-muted-foreground",
            error && "border-destructive"
          )}
        >
          <span className="truncate uppercase tracking-wider">
            {value
              ? brands.find((brand) => brand.name === value)?.name || value
              : "SÉLECTIONNER UNE MARQUE"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-luxury-charcoal border-white/10 rounded-none shadow-2xl z-[100]" align="start">
        <Command className="bg-transparent text-white border-none">
          <CommandInput 
            placeholder="RECHERCHER UNE MARQUE..." 
            className="h-14 border-none border-b border-white/5 focus:ring-0 text-white placeholder:text-white/20 font-heading text-[11px] tracking-widest"
          />
          <CommandList className="max-h-[300px] scrollbar-thin scrollbar-thumb-white/10">
            <CommandEmpty className="py-10 text-center text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold">
              Aucune unité détectée
            </CommandEmpty>
            <CommandGroup className="p-2">
              {brands.map((brand) => (
                <CommandItem
                  key={brand.id}
                  value={brand.name}
                  onSelect={(currentValue) => {
                    // currentValue is always lowercase in cmdk, so we find the original name
                    const matchedBrand = brands.find(b => b.name.toLowerCase() === currentValue.toLowerCase());
                    onChange(matchedBrand ? matchedBrand.name : currentValue);
                    setOpen(false)
                  }}
                  className="py-3 px-4 aria-selected:bg-racing-red/20 aria-selected:text-white cursor-pointer transition-colors rounded-none flex items-center justify-between group"
                >
                  <span className="uppercase tracking-widest text-xs font-bold group-hover:translate-x-1 transition-transform">
                    {brand.name}
                  </span>
                  <Check
                    className={cn(
                      "h-4 w-4 text-racing-red transition-all",
                      value === brand.name ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
