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
  ChevronDown,
  CreditCard,
  Receipt,
  HandCoins,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { usePermissions } from "@/lib/hooks/use-permissions"
import type { Permission } from "@/lib/permissions"

/**
 * Sidebar principale du dashboard
 * Navigation avec icônes et sous-menus collapsibles
 */

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  permission?: Permission
  children?: { title: string; href: string; permission?: Permission }[]
}

const navigation: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Paroissiens",
    href: "/paroissiens",
    icon: Users,
    permission: "view-paroissiens",
  },
  {
    title: "Associations",
    href: "/associations",
    icon: Building2,
    permission: "view-associations",
  },
  {
    title: "Finances",
    href: "/finances",
    icon: Wallet,
    permission: "view-engagements",
    children: [
      { title: "Engagements", href: "/finances/engagements", permission: "view-engagements" },
      { title: "Versements", href: "/finances/versements", permission: "view-versements" },
      { title: "Offrandes", href: "/finances/offrandes", permission: "view-offrandes" },
    ],
  },
  {
    title: "Rapports",
    href: "/rapports",
    icon: FileText,
    permission: "view-reports",
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
    permission: "manage-system",
  },
]

const financeIcons: Record<string, React.ElementType> = {
  "/finances/engagements": CreditCard,
  "/finances/versements": Receipt,
  "/finances/offrandes": HandCoins,
}

export function Sidebar() {
  const pathname = usePathname()
  const { can } = usePermissions()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Church className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold">Church Management</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigation.map((item) => {
          // Vérifier la permission
          if (item.permission && !can(item.permission)) {
            return null
          }

          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          // Item avec enfants (collapsible)
          if (item.children) {
            return (
              <Collapsible key={item.href} defaultOpen={isActive}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between",
                      isActive && "bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 pt-1 space-y-1">
                  {item.children.map((child) => {
                    if (child.permission && !can(child.permission)) {
                      return null
                    }
                    const childActive = pathname === child.href
                    const ChildIcon = financeIcons[child.href] || FileText
                    
                    return (
                      <Button
                        key={child.href}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start gap-3",
                          childActive && "bg-muted font-medium"
                        )}
                        asChild
                      >
                        <Link href={child.href}>
                          <ChildIcon className="h-4 w-4" />
                          {child.title}
                        </Link>
                      </Button>
                    )
                  })}
                </CollapsibleContent>
              </Collapsible>
            )
          }

          // Item simple
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
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Church Management
        </p>
      </div>
    </aside>
  )
}
