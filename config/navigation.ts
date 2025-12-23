import type { NavItem } from "@/types"

/**
 * Configuration de la navigation principale
 * Les permissions déterminent l'affichage selon le rôle
 */

export const mainNavigation: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/",
    icon: "LayoutDashboard",
  },
  {
    title: "Paroissiens",
    href: "/paroissiens",
    icon: "Users",
    permissions: ["view-paroissiens"],
  },
  {
    title: "Associations",
    href: "/associations",
    icon: "Building2",
    permissions: ["view-associations"],
  },
  {
    title: "Finances",
    href: "/finances",
    icon: "Wallet",
    permissions: ["view-engagements", "view-versements", "view-cotisations", "view-offrandes"],
    children: [
      {
        title: "Engagements",
        href: "/finances/engagements",
        permissions: ["view-engagements"],
      },
      {
        title: "Versements",
        href: "/finances/versements",
        permissions: ["view-versements"],
      },
      {
        title: "Offrandes",
        href: "/finances/offrandes",
        permissions: ["view-offrandes"],
      },
    ],
  },
  {
    title: "Rapports",
    href: "/rapports",
    icon: "FileText",
    permissions: ["view-reports"],
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: "Settings",
    permissions: ["manage-system"],
  },
]

/**
 * Récupère les items de navigation filtrés par permissions
 */
export function getFilteredNavigation(
  items: NavItem[],
  hasPermission: (permission: string) => boolean
): NavItem[] {
  return items
    .filter((item) => {
      // Si pas de permissions requises, toujours afficher
      if (!item.permissions || item.permissions.length === 0) {
        return true
      }
      // Au moins une permission doit être présente
      return item.permissions.some((p) => hasPermission(p))
    })
    .map((item) => ({
      ...item,
      // Filtrer aussi les enfants
      children: item.children
        ? getFilteredNavigation(item.children, hasPermission)
        : undefined,
    }))
    .filter((item) => {
      // Si l'item a des enfants mais tous sont filtrés, on le cache
      if (item.children && item.children.length === 0) {
        return false
      }
      return true
    })
}
