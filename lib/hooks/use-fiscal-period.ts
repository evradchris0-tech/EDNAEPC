"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store Zustand pour la période fiscale
 * Persiste dans localStorage
 * Remplace le ModelScope de Laravel
 */

interface FiscalPeriodState {
  year: number
  trimestre: number | null // null = toute l'année
  setYear: (year: number) => void
  setTrimestre: (trimestre: number | null) => void
  reset: () => void
}

const currentYear = new Date().getFullYear()

export const useFiscalPeriod = create<FiscalPeriodState>()(
  persist(
    (set) => ({
      year: currentYear,
      trimestre: null,
      setYear: (year) => set({ year }),
      setTrimestre: (trimestre) => set({ trimestre }),
      reset: () => set({ year: currentYear, trimestre: null }),
    }),
    {
      name: 'fiscal-period-storage',
    }
  )
)

/**
 * Helper pour obtenir les dates de début et fin d'un trimestre
 */
export function getTrimestreDates(year: number, trimestre: number | null): {
  start: Date
  end: Date
} {
  if (trimestre === null) {
    return {
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 31, 23, 59, 59),
    }
  }

  const startMonth = (trimestre - 1) * 3
  const endMonth = startMonth + 2

  return {
    start: new Date(year, startMonth, 1),
    end: new Date(year, endMonth + 1, 0, 23, 59, 59),
  }
}

/**
 * Options pour le select des trimestres
 */
export const trimestreOptions = [
  { value: null, label: 'Toute l\'année' },
  { value: 1, label: '1er trimestre (Jan-Mar)' },
  { value: 2, label: '2ème trimestre (Avr-Juin)' },
  { value: 3, label: '3ème trimestre (Juil-Sep)' },
  { value: 4, label: '4ème trimestre (Oct-Déc)' },
]

/**
 * Génère les options pour les années (10 ans en arrière)
 */
export function getYearOptions(): { value: number; label: string }[] {
  const years = []
  for (let i = 0; i <= 10; i++) {
    const year = currentYear - i
    years.push({ value: year, label: year.toString() })
  }
  return years
}
