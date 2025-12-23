"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Church,
  LayoutDashboard, 
  Users, 
  Building2, 
  Wallet,
  FileText,
  Settings,
  CreditCard,
  Receipt,
  HandCoins,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { usePermissions } from "@/lib/hooks/use-permissions"
import { FiscalPeriodSelector } from "./fiscal-period-selector"
import type { Permission } from "@/lib/permissions"

/**
 * Sidebar mobile (affichée dans un Sheet)
 */

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  permission?: Permission
}

const mainNav: NavItem[] = [
  { title: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { title: "Paroissiens", href: "/paroissiens", icon: Users, permission: "view-paroissiens" },
  { title: "Associations", href: "/associations", icon: Building2, permission: "view-associations" },
]

const financeNav: NavItem[] = [
  { title: "Engagements", href: "/finances/engagements", icon: CreditCard, permission: "view-engagements" },
  { title: "Versements", href: "/finances/versements", icon: Receipt, permission: "view-versements" },
  { title: "Offrandes", href: "/finances/offrandes", icon: HandCoins, permission: "view-offrandes" },
]

const otherNav: NavItem[] = [
  { title: "Rapports", href: "/rapports", icon: FileText, permission: "view-reports" },
  { title: "Paramètres", href: "/settings", icon: Settings, permission: "manage-system" },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const { can } = usePermissions()

  const renderNavItem = (item: NavItem) => {
    if (item.permission && !can(item.permission)) return null
    
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
    const Icon = item.icon

    return (
      <Button
        key={item.href}
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3",
          isActive && "bg-muted font-medium"
        )}
        asChild
      >
        <Link href={item.href}>
          <Icon className="h-4 w-4" />
          {item.title}
        </Link>
      </Button>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <SheetHeader className="p-4 border-b">
        <SheetTitle className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Church className="h-5 w-5 text-primary-foreground" />
          </div>
          Church Management
        </SheetTitle>
      </SheetHeader>

      {/* Période fiscale */}
      <div className="p-4 border-b">
        <p className="text-xs text-muted-foreground mb-2">Période fiscale</p>
        <FiscalPeriodSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Navigation principale */}
        <div className="space-y-1">
          {mainNav.map(renderNavItem)}
        </div>

        {/* Finances */}
        <div>
          <p className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="h-3 w-3" />
            Finances
          </p>
          <div className="space-y-1">
            {financeNav.map(renderNavItem)}
          </div>
        </div>

        <Separator />

        {/* Autres */}
        <div className="space-y-1">
          {otherNav.map(renderNavItem)}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Church Management
        </p>
      </div>
    </div>
  )
}
