import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

import { SessionProvider } from "@/components/providers/session-provider"

/**
 * Layout racine de l'application
 * Inclut le SessionProvider pour l'authentification
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Church Management System",
    template: "%s | Church Management",
  },
  description: "Système de gestion d'église - Paroissiens, Finances, Associations",
  keywords: ["église", "gestion", "paroissiens", "finances", "associations"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          {children}
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  )
}
