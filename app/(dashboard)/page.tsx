import Link from "next/link"
import { Users, Building2, Receipt, TrendingUp, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getDashboardStats, getFinanceDashboardStats, getRecentActivity } from "@/server/queries/dashboard"
import { formatCurrency, formatDate } from "@/lib/utils"
import { MonthlyChart } from "@/components/charts/monthly-chart"
import { TypePieChart } from "@/components/charts/pie-chart"

export default async function DashboardPage() {
  const year = new Date().getFullYear()
  
  const [stats, financeStats, activity] = await Promise.all([
    getDashboardStats(),
    getFinanceDashboardStats(year),
    getRecentActivity(),
  ])

  const recoveryRate = financeStats.totalEngagements > 0 
    ? Math.round((financeStats.totalVersements / financeStats.totalEngagements) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans le systeme de gestion</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paroissiens</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParoissiens}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{stats.paroissiensByCategorie.ANCIEN || 0} Anciens</Badge>
              <Badge variant="outline">{stats.paroissiensByCategorie.DIACRE || 0} Diacres</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Associations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssociations}</div>
            <p className="text-xs text-muted-foreground mt-2">Groupes actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Versements {year}</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financeStats.totalVersements)}</div>
            <p className="text-xs text-muted-foreground mt-2">{financeStats.countVersements} versements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recouvrement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recoveryRate}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(financeStats.totalVersements)} / {formatCurrency(financeStats.totalEngagements)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Versements mensuels</CardTitle>
            <CardDescription>Evolution des versements en {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={financeStats.monthlyData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repartition par type</CardTitle>
            <CardDescription>Types de versements en {year}</CardDescription>
          </CardHeader>
          <CardContent>
            {financeStats.versementsByType.length > 0 ? (
              <TypePieChart data={financeStats.versementsByType} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Aucun versement
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Derniers paroissiens</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/paroissiens">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentParoissiens.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.matricule}</p>
                  </div>
                  <Badge variant="outline">{p.categorie}</Badge>
                </div>
              ))}
              {stats.recentParoissiens.length === 0 && (
                <p className="text-muted-foreground text-center py-4">Aucun paroissien</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Derniers versements</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/finances/versements">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.recentVersements.map((v) => (
                <div key={v.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{v.paroissien.name}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(v.dateVersement)}</p>
                  </div>
                  <span className="font-medium text-green-600">
                    +{formatCurrency(Number(v.somme))}
                  </span>
                </div>
              ))}
              {activity.recentVersements.length === 0 && (
                <p className="text-muted-foreground text-center py-4">Aucun versement</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
