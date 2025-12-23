import { db } from "@/lib/db"
import type { ParoissienFilter } from "@/lib/validations/paroissien"
import type { PaginatedResult } from "@/types"
import type { Paroissien, Association, Prisma } from "@prisma/client"

/**
 * Queries pour les paroissiens
 * Fonctions de lecture seule (pas de mutations)
 */

// Type étendu avec associations
export type ParoissienWithAssociations = Paroissien & {
  associations: {
    association: Association
    isPrimary: boolean
  }[]
}

/**
 * Récupère la liste des paroissiens avec pagination et filtres
 */
export async function getParoissiens(
  filters: ParoissienFilter
): Promise<PaginatedResult<ParoissienWithAssociations>> {
  const { search, categorie, genre, situation, associationId, isActive, page, limit, sortBy, sortOrder } = filters

  // Construction du where clause
  const where: Prisma.ParoissienWhereInput = {}

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { matricule: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ]
  }

  if (categorie) where.categorie = categorie
  if (genre) where.genre = genre
  if (situation) where.situation = situation
  if (isActive !== undefined) where.isActive = isActive

  if (associationId) {
    where.associations = {
      some: { associationId },
    }
  }

  // Compter le total
  const total = await db.paroissien.count({ where })

  // Récupérer les données
  const data = await db.paroissien.findMany({
    where,
    include: {
      associations: {
        include: {
          association: true,
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
 * Récupère un paroissien par son ID
 */
export async function getParoissienById(
  id: string
): Promise<ParoissienWithAssociations | null> {
  return db.paroissien.findUnique({
    where: { id },
    include: {
      associations: {
        include: {
          association: true,
        },
      },
    },
  })
}

/**
 * Récupère un paroissien par son matricule
 */
export async function getParoissienByMatricule(
  matricule: string
): Promise<ParoissienWithAssociations | null> {
  return db.paroissien.findUnique({
    where: { matricule },
    include: {
      associations: {
        include: {
          association: true,
        },
      },
    },
  })
}

/**
 * Récupère toutes les associations pour les selects
 */
export async function getAssociations() {
  return db.association.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      sigle: true,
    },
  })
}

/**
 * Compte les paroissiens par catégorie
 */
export async function countParoissiensByCategorie() {
  const counts = await db.paroissien.groupBy({
    by: ["categorie"],
    where: { isActive: true },
    _count: true,
  })

  return counts.reduce(
    (acc, item) => {
      acc[item.categorie] = item._count
      return acc
    },
    {} as Record<string, number>
  )
}
