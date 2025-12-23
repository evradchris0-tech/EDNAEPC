import { db } from "@/lib/db"

export async function getDashboardStats() {
  const [
    totalParoissiens,
    totalAssociations,
    paroissiensByCategorie,
    recentParoissiens,
  ] = await Promise.all([
    db.paroissien.count({ where: { isActive: true } }),
    db.association.count({ where: { isActive: true } }),
    db.paroissien.groupBy({
      by: ["categorie"],
      where: { isActive: true },
      _count: true,
    }),
    db.paroissien.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, matricule: true, categorie: true, createdAt: true },
    }),
  ])

  return {
    totalParoissiens,
    totalAssociations,
    paroissiensByCategorie: paroissiensByCategorie.reduce(
      (acc, item) => ({ ...acc, [item.categorie]: item._count }),
      {} as Record<string, number>
    ),
    recentParoissiens,
  }
}

export async function getFinanceDashboardStats(year: number) {
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)

  const [engagements, versements, versementsByMonth, versementsByType] = await Promise.all([
    db.engagement.aggregate({
      where: { periodeStart: { gte: start }, periodeEnd: { lte: end } },
      _sum: { dime: true, cotisation: true, availableDime: true, availableCotisation: true },
      _count: true,
    }),
    db.versement.aggregate({
      where: { dateVersement: { gte: start, lte: end } },
      _sum: { somme: true },
      _count: true,
    }),
    db.$queryRaw`
      SELECT 
        MONTH(dateVersement) as month,
        SUM(somme) as total
      FROM versements
      WHERE dateVersement >= ${start} AND dateVersement <= ${end}
      GROUP BY MONTH(dateVersement)
      ORDER BY month
    ` as Promise<{ month: number; total: number }[]>,
    db.versement.groupBy({
      by: ["type"],
      where: { dateVersement: { gte: start, lte: end } },
      _sum: { somme: true },
    }),
  ])

  const monthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"]
  const monthlyData = monthNames.map((name, index) => {
    const found = versementsByMonth.find((v) => v.month === index + 1)
    return { name, total: found ? Number(found.total) : 0 }
  })

  return {
    totalEngagements: Number(engagements._sum.dime || 0) + Number(engagements._sum.cotisation || 0),
    totalReceived: Number(engagements._sum.availableDime || 0) + Number(engagements._sum.availableCotisation || 0),
    totalVersements: Number(versements._sum.somme || 0),
    countVersements: versements._count,
    countEngagements: engagements._count,
    monthlyData,
    versementsByType: versementsByType.map((v) => ({
      type: v.type,
      total: Number(v._sum.somme || 0),
    })),
  }
}

export async function getRecentActivity() {
  const [recentVersements, recentEngagements] = await Promise.all([
    db.versement.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { paroissien: { select: { name: true } } },
    }),
    db.engagement.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { paroissien: { select: { name: true } } },
    }),
  ])

  return { recentVersements, recentEngagements }
}
