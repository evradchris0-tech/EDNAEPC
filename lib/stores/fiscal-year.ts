import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FiscalYearState {
  year: number
  setYear: (year: number) => void
}

export const useFiscalYear = create<FiscalYearState>()(
  persist(
    (set) => ({
      year: new Date().getFullYear(),
      setYear: (year) => set({ year }),
    }),
    {
      name: "fiscal-year",
    }
  )
)

// Helper pour obtenir les années disponibles
export function getAvailableYears(startYear = 2020): number[] {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year)
  }
  return years
}
