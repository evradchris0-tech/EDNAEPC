"use client"

import { Calendar } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFiscalYear, getAvailableYears } from "@/lib/stores/fiscal-year"

interface YearSelectorProps {
  className?: string
}

export function YearSelector({ className }: YearSelectorProps) {
  const { year, setYear } = useFiscalYear()
  const years = getAvailableYears()

  return (
    <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
      <SelectTrigger className={className}>
        <Calendar className="mr-2 h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={y.toString()}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
