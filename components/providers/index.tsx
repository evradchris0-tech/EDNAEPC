"use client"

import { SessionProvider } from "./session-provider"

/**
 * Providers combinés de l'application
 * Ajouter ici tous les providers globaux (theme, query, etc.)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
