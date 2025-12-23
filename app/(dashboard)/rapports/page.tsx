import { FileText, Download, Users, CreditCard, Receipt, HandCoins } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDashboardStats, getFinanceDashboardStats } from "@/server/queries/dashboard"
import { formatCurrency } from "@/lib/utils"

export const metadata = { title: "Rapports" }

export default async function RapportsPage() {
  const year = new Date().getFullYear()
  const [stats, financeStats] = await Promise.all([
    getDashboardStats(),
    getFinanceDashboardStats(year),
  ])

  const reports = [
    {
      title: "Liste des paroissiens",
      description: "Export complet de tous les membres actifs",
      icon: Users,
      href: "/api/reports/paroissiens",
      count: stats.totalParoissiens,
    },
    {
      title: "Engagements annuels",
      description: "Synthese des engagements par paroissien",
      icon: CreditCard,
      href: "/api/reports/engagements",
      count: financeStats.countEngagements,
    },
    {
      title: "Versements",
      description: "Detail de tous les versements de l annee",
      icon: Receipt,
      href: "/api/reports/versements",
      count: financeStats.countVersements,
    },
    {
      title: "Offrandes associations",
      description: "Recapitulatif des offrandes par association",
      icon: HandCoins,
      href: "/api/reports/offrandes",
      count: null,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rapports</h1>
        <p className="text-muted-foreground">
          Generez et telechargez les rapports pour l annee {year}
        </p>
      </div>

      {/* Resume */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Paroissiens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParoissiens}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Engagements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financeStats.totalEngagements)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Versements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financeStats.totalVersements)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Taux Recouvrement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financeStats.totalEngagements > 0 
                ? Math.round((financeStats.totalVersements / financeStats.totalEngagements) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rapports disponibles */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Rapports disponibles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.title}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <report.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {report.count !== null && (
                    <span className="text-sm text-muted-foreground">
                      {report.count} enregistrement(s)
                    </span>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <Button variant="outline" size="sm" disabled>
                      <FileText className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Les exports PDF et Excel seront disponibles dans une prochaine version.
            Utilisez les listes dans chaque module pour exporter les donnees.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
