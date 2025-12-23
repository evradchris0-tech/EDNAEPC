import type { Role } from "@prisma/client"

/**
 * Système de permissions RBAC
 * Basé sur Spatie Laravel Permission
 */

// Liste des permissions disponibles
export const PERMISSIONS = {
  // Utilisateurs
  'view-users': 'Voir les utilisateurs',
  'create-users': 'Créer des utilisateurs',
  'edit-users': 'Modifier des utilisateurs',
  'delete-users': 'Supprimer des utilisateurs',

  // Paroissiens
  'view-paroissiens': 'Voir les paroissiens',
  'create-paroissiens': 'Créer des paroissiens',
  'edit-paroissiens': 'Modifier des paroissiens',
  'delete-paroissiens': 'Supprimer des paroissiens',

  // Associations
  'view-associations': 'Voir les associations',
  'create-associations': 'Créer des associations',
  'edit-associations': 'Modifier des associations',
  'delete-associations': 'Supprimer des associations',

  // Engagements
  'view-engagements': 'Voir les engagements',
  'create-engagements': 'Créer des engagements',
  'edit-engagements': 'Modifier des engagements',
  'delete-engagements': 'Supprimer des engagements',

  // Versements
  'view-versements': 'Voir les versements',
  'create-versements': 'Créer des versements',
  'edit-versements': 'Modifier des versements',
  'delete-versements': 'Supprimer des versements',

  // Cotisations
  'view-cotisations': 'Voir les cotisations',
  'create-cotisations': 'Créer des cotisations',
  'edit-cotisations': 'Modifier des cotisations',
  'delete-cotisations': 'Supprimer des cotisations',

  // Offrandes
  'view-offrandes': 'Voir les offrandes',
  'create-offrandes': 'Créer des offrandes',
  'edit-offrandes': 'Modifier des offrandes',
  'delete-offrandes': 'Supprimer des offrandes',

  // Rapports
  'view-reports': 'Voir les rapports',
  'export-data': 'Exporter les données',

  // Système
  'manage-system': 'Gérer le système',
} as const

export type Permission = keyof typeof PERMISSIONS

// Matrice des permissions par rôle
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: Object.keys(PERMISSIONS) as Permission[],

  ADMIN: [
    'view-users', 'create-users', 'edit-users',
    'view-paroissiens', 'create-paroissiens', 'edit-paroissiens', 'delete-paroissiens',
    'view-associations', 'create-associations', 'edit-associations', 'delete-associations',
    'view-engagements', 'create-engagements', 'edit-engagements', 'delete-engagements',
    'view-versements', 'create-versements', 'edit-versements', 'delete-versements',
    'view-cotisations', 'create-cotisations', 'edit-cotisations', 'delete-cotisations',
    'view-offrandes', 'create-offrandes', 'edit-offrandes', 'delete-offrandes',
    'view-reports', 'export-data',
  ],

  GESTIONNAIRE: [
    'view-paroissiens', 'create-paroissiens', 'edit-paroissiens',
    'view-associations',
    'view-engagements', 'create-engagements', 'edit-engagements',
    'view-reports',
  ],

  TRESORIER: [
    'view-paroissiens',
    'view-cotisations', 'create-cotisations', 'edit-cotisations',
    'view-versements', 'create-versements', 'edit-versements',
    'view-offrandes', 'create-offrandes', 'edit-offrandes',
    'view-reports', 'export-data',
  ],

  SECRETAIRE: [
    'view-paroissiens', 'create-paroissiens', 'edit-paroissiens',
    'view-associations',
    'view-engagements',
    'view-cotisations',
    'view-versements',
    'view-reports',
  ],
}

/**
 * Vérifie si un rôle a une permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/**
 * Vérifie si un rôle a toutes les permissions données
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p))
}

/**
 * Vérifie si un rôle a au moins une des permissions données
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p))
}

/**
 * Récupère toutes les permissions d'un rôle
 */
export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}
