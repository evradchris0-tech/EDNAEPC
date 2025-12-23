"use client"

import { Calendar } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFiscalPeriod, trimestreOptions, getYearOptions } from "@/lib/hooks/use-fiscal-period"

/**
 * Sélecteur de période fiscale (année + trimestre)
 * Stocké dans Zustand avec persistance localStorage
 */

export function FiscalPeriodSelector() {
  const { year, trimestre, setYear, setTrimestre } = useFiscalPeriod()
  const yearOptions = getYearOptions()

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      
      {/* Sélecteur d'année */}
      <Select
        value={year.toString()}
        onValueChange={(value) => setYear(parseInt(value))}
      >
        <SelectTrigger className="w-[100px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sélecteur de trimestre */}
      <Select
        value={trimestre?.toString() ?? "all"}
        onValueChange={(value) => setTrimestre(value === "all" ? null : parseInt(value))}
      >
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {trimestreOptions.map((option) => (
            <SelectItem 
              key={option.value ?? "all"} 
              value={option.value?.toString() ?? "all"}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
