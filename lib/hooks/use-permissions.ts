"use client"

import { useSession } from "next-auth/react"
import { hasPermission, hasAnyPermission, hasAllPermissions, type Permission } from "@/lib/permissions"

/**
 * Hook pour vérifier les permissions de l'utilisateur connecté
 */

export function usePermissions() {
  const { data: session } = useSession()
  const role = session?.user?.role

  return {
    /**
     * Vérifie si l'utilisateur a une permission spécifique
     */
    can: (permission: Permission): boolean => {
      if (!role) return false
      return hasPermission(role, permission)
    },

    /**
     * Vérifie si l'utilisateur a toutes les permissions
     */
    canAll: (permissions: Permission[]): boolean => {
      if (!role) return false
      return hasAllPermissions(role, permissions)
    },

    /**
     * Vérifie si l'utilisateur a au moins une des permissions
     */
    canAny: (permissions: Permission[]): boolean => {
      if (!role) return false
      return hasAnyPermission(role, permissions)
    },

    /**
     * Rôle actuel de l'utilisateur
     */
    role,

    /**
     * Est-ce un super admin?
     */
    isSuperAdmin: role === 'SUPER_ADMIN',

    /**
     * Est-ce un admin (SUPER_ADMIN ou ADMIN)?
     */
    isAdmin: role === 'SUPER_ADMIN' || role === 'ADMIN',
  }
}
