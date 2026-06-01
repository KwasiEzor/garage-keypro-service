import { usePage } from "@inertiajs/react"
import { Check, ChevronDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Service {
  id: number
  name: string
  slug: string
}

interface ServiceSelectProps {
  value: string | number
  onChange: (value: string) => void
  error?: string
}

export function ServiceSelect({ value, onChange, error }: ServiceSelectProps) {
  const { services = [] } = usePage().props as unknown as { services: Service[] }

  return (
    <Select value={value.toString()} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-14 w-full bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none font-medium px-4",
          !value && "text-muted-foreground",
          error && "border-destructive"
        )}
      >
        <SelectValue placeholder="SÉLECTIONNER UN SERVICE" />
      </SelectTrigger>
      <SelectContent className="bg-luxury-charcoal border-white/10 rounded-none shadow-2xl z-[100]">
        {services.map((service) => (
          <SelectItem
            key={service.id}
            value={service.id.toString()}
            className="py-3 px-4 focus:bg-racing-red/20 focus:text-white cursor-pointer transition-colors rounded-none uppercase tracking-widest text-xs font-bold"
          >
            {service.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
