import { db } from "@/lib/db"
import type { AssociationFilter } from "@/lib/validations/association"
import type { PaginatedResult } from "@/types"
import type { Association, Paroissien, Prisma } from "@prisma/client"

/**
 * Queries pour les associations
 * Fonctions de lecture seule (pas de mutations)
 */

// Type étendu avec membres
export type AssociationWithMembers = Association & {
  paroissiens: {
    paroissien: Pick<Paroissien, "id" | "name" | "matricule" | "categorie">
    isPrimary: boolean
    statut: string | null
    dateAdhesion: Date
  }[]
  _count: {
    paroissiens: number
    offrandes: number
  }
}

// Type simple pour les listes
export type AssociationWithCount = Association & {
  _count: {
    paroissiens: number
    offrandes: number
  }
}

/**
 * Récupère la liste des associations avec pagination et filtres
 */
export async function getAssociations(
  filters: AssociationFilter
): Promise<PaginatedResult<AssociationWithCount>> {
  const { search, isActive, page, limit, sortBy, sortOrder } = filters

  // Construction du where clause
  const where: Prisma.AssociationWhereInput = {}

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sigle: { contains: search } },
    ]
  }

  if (isActive !== undefined) where.isActive = isActive

  // Compter le total
  const total = await db.association.count({ where })

  // Récupérer les données
  const data = await db.association.findMany({
    where,
    include: {
      _count: {
        select: {
          paroissiens: true,
          offrandes: true,
        },
      },
    },
    orderBy: { [sortBy || "name"]: sortOrder || "asc" },
    skip: (page - 1) * limit,
    take: limit,
  })

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Récupère une association par son ID avec ses membres
 */
export async function getAssociationById(
  id: string
): Promise<AssociationWithMembers | null> {
  return db.association.findUnique({
    where: { id },
    include: {
      paroissiens: {
        include: {
          paroissien: {
            select: {
              id: true,
              name: true,
              matricule: true,
              categorie: true,
            },
          },
        },
        orderBy: [
          { isPrimary: "desc" },
          { paroissien: { name: "asc" } },
        ],
      },
      _count: {
        select: {
          paroissiens: true,
          offrandes: true,
        },
      },
    },
  })
}

/**
 * Récupère toutes les associations pour les selects
 */
export async function getAssociationsForSelect() {
  return db.association.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      sigle: true,
    },
    orderBy: { name: "asc" },
  })
}

/**
 * Statistiques des associations
 */
export async function getAssociationsStats() {
  const [total, active, withMembers] = await Promise.all([
    db.association.count(),
    db.association.count({ where: { isActive: true } }),
    db.association.count({
      where: {
        paroissiens: { some: {} },
      },
    }),
  ])

  return {
    total,
    active,
    inactive: total - active,
    withMembers,
    empty: total - withMembers,
  }
}

/**
 * Récupère les offrandes d'une association
 */
export async function getAssociationOffrandes(associationId: string, year?: number) {
  const where: Prisma.OffrandeWhereInput = { associationId }

  if (year) {
    const start = new Date(year, 0, 1)
    const end = new Date(year, 11, 31)
    where.offrandeDay = { gte: start, lte: end }
  }

  return db.offrande.findMany({
    where,
    orderBy: { offrandeDay: "desc" },
  })
}

/**
 * Compte les membres par association
 */
export async function countMembersByAssociation() {
  const counts = await db.association.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      sigle: true,
      _count: {
        select: { paroissiens: true },
      },
    },
    orderBy: { name: "asc" },
  })

  return counts.map((a) => ({
    id: a.id,
    name: a.name,
    sigle: a.sigle,
    count: a._count.paroissiens,
  }))
}
