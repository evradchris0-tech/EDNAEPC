"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

/**
 * Provider de session Auth.js
 * Wrapper pour SessionProvider de next-auth
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  )
}
