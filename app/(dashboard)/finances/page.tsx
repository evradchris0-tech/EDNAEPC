import Link from "next/link"
import { CreditCard, Receipt, HandCoins, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getFinanceStats } from "@/server/queries/finances"
import { formatCurrency } from "@/lib/utils"

export const metadata = { title: "Finances" }

export default async function FinancesPage() {
  const year = new Date().getFullYear()
  const stats = await getFinanceStats(year)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finances</h1>
        <p className="text-muted-foreground">
          Vue d ensemble des finances pour {year}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagements</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.engagementsTotal)}</div>
            <p className="text-xs text-muted-foreground">Total des engagements</p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/finances/engagements">Voir les engagements</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Versements</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.versementsTotal)}</div>
            <p className="text-xs text-muted-foreground">Total des versements</p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/finances/versements">Voir les versements</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Offrandes</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.offrandesTotale)}</div>
            <p className="text-xs text-muted-foreground">Total des offrandes</p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/finances/offrandes">Voir les offrandes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Taux de recouvrement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {stats.engagementsTotal > 0 ? (
              <>
                <div className="text-4xl font-bold">
                  {Math.round((stats.versementsTotal / stats.engagementsTotal) * 100)}%
                </div>
                <p className="text-muted-foreground mt-2">
                  {formatCurrency(stats.versementsTotal)} / {formatCurrency(stats.engagementsTotal)}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Aucun engagement pour cette annee</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
