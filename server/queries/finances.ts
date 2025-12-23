import { db } from "@/lib/db"
import type { Engagement, Versement, Offrande, Paroissien, Association, Prisma, TypeVersement } from "@prisma/client"

// Types
export type EngagementWithParoissien = Engagement & {
  paroissien: Pick<Paroissien, "id" | "name" | "matricule">
}

export type VersementWithRelations = Versement & {
  paroissien: Pick<Paroissien, "id" | "name" | "matricule">
  engagement: Engagement | null
}

export type OffrandeWithAssociation = Offrande & {
  association: Pick<Association, "id" | "name" | "sigle">
}

// Engagements
export async function getEngagements(year?: number) {
  const where: Prisma.EngagementWhereInput = {}
  if (year) {
    where.periodeStart = { gte: new Date(year, 0, 1) }
    where.periodeEnd = { lte: new Date(year, 11, 31) }
  }

  return db.engagement.findMany({
    where,
    include: {
      paroissien: { select: { id: true, name: true, matricule: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getEngagementById(id: string) {
  return db.engagement.findUnique({
    where: { id },
    include: {
      paroissien: { select: { id: true, name: true, matricule: true } },
      versements: true,
    },
  })
}

export async function getEngagementsByParoissien(paroissienId: string) {
  return db.engagement.findMany({
    where: { paroissienId },
    orderBy: { periodeStart: "desc" },
  })
}

// Versements
export async function getVersements(filters?: { year?: number; type?: TypeVersement; paroissienId?: string }) {
  const where: Prisma.VersementWhereInput = {}
  
  if (filters?.year) {
    const start = new Date(filters.year, 0, 1)
    const end = new Date(filters.year, 11, 31)
    where.dateVersement = { gte: start, lte: end }
  }
  if (filters?.type) where.type = filters.type
  if (filters?.paroissienId) where.paroissienId = filters.paroissienId

  return db.versement.findMany({
    where,
    include: {
      paroissien: { select: { id: true, name: true, matricule: true } },
      engagement: true,
    },
    orderBy: { dateVersement: "desc" },
  })
}

export async function getVersementById(id: string) {
  return db.versement.findUnique({
    where: { id },
    include: {
      paroissien: { select: { id: true, name: true, matricule: true } },
      engagement: true,
    },
  })
}

// Offrandes
export async function getOffrandes(filters?: { year?: number; associationId?: string }) {
  const where: Prisma.OffrandeWhereInput = {}
  
  if (filters?.year) {
    const start = new Date(filters.year, 0, 1)
    const end = new Date(filters.year, 11, 31)
    where.offrandeDay = { gte: start, lte: end }
  }
  if (filters?.associationId) where.associationId = filters.associationId

  return db.offrande.findMany({
    where,
    include: {
      association: { select: { id: true, name: true, sigle: true } },
    },
    orderBy: { offrandeDay: "desc" },
  })
}

export async function getOffrandeById(id: string) {
  return db.offrande.findUnique({
    where: { id },
    include: {
      association: { select: { id: true, name: true, sigle: true } },
    },
  })
}

// Stats
export async function getFinanceStats(year: number) {
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)

  const [totalEngagements, totalVersements, totalOffrandes] = await Promise.all([
    db.engagement.aggregate({
      where: { periodeStart: { gte: start }, periodeEnd: { lte: end } },
      _sum: { dime: true, cotisation: true },
    }),
    db.versement.aggregate({
      where: { dateVersement: { gte: start, lte: end } },
      _sum: { somme: true },
    }),
    db.offrande.aggregate({
      where: { offrandeDay: { gte: start, lte: end } },
      _sum: { somme: true },
    }),
  ])

  return {
    engagementsTotal: Number(totalEngagements._sum.dime || 0) + Number(totalEngagements._sum.cotisation || 0),
    versementsTotal: Number(totalVersements._sum.somme || 0),
    offrandesTotale: Number(totalOffrandes._sum.somme || 0),
  }
}

// Pour les selects
export async function getParoissiensForSelect() {
  return db.paroissien.findMany({
    where: { isActive: true },
    select: { id: true, name: true, matricule: true },
    orderBy: { name: "asc" },
  })
}

export async function getAssociationsForSelect() {
  return db.association.findMany({
    where: { isActive: true },
    select: { id: true, name: true, sigle: true },
    orderBy: { name: "asc" },
  })
}
