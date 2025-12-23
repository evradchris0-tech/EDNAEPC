/**
 * Types partagés pour l'application
 */

// Réponse standard des Server Actions
export type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

// Options de pagination
export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Résultat paginé
export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Options de filtre pour paroissiens
export interface ParoissienFilters {
  search?: string
  categorie?: string
  genre?: string
  associationId?: string
  year?: number
  trimestre?: number
}

// Options de filtre pour finances
export interface FinanceFilters {
  paroissienId?: string
  year?: number
  trimestre?: number
  type?: string
  dateFrom?: Date
  dateTo?: Date
}

// Période fiscale (année/trimestre)
export interface FiscalPeriod {
  year: number
  trimestre: number | null // null = toute l'année
}

// Stats du dashboard
export interface DashboardStats {
  totalParoissiens: number
  totalAssociations: number
  totalEngagements: number
  totalVersements: number
  recentActivities: Activity[]
}

// Activité récente
export interface Activity {
  id: string
  type: 'paroissien' | 'versement' | 'engagement' | 'offrande'
  action: 'create' | 'update' | 'delete'
  description: string
  createdAt: Date
  userId: string
}

// Navigation item
export interface NavItem {
  title: string
  href: string
  icon?: string
  permissions?: string[]
  children?: NavItem[]
}
