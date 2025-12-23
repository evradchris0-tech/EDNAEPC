import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

/**
 * Layout principal du dashboard
 * Protégé par authentification
 * Contient la sidebar et le header
 */

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Vérification de la session côté serveur
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar (desktop) */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
