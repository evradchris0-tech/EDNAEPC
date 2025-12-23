import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getEngagements } from "@/server/queries/finances"
import { formatCurrency } from "@/lib/utils"

export const metadata = { title: "Engagements" }

export default async function EngagementsPage() {
  const engagements = await getEngagements()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Engagements</h1>
          <p className="text-muted-foreground">
            Gestion des engagements financiers des paroissiens
          </p>
        </div>
        <Button asChild>
          <Link href="/finances/engagements/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel engagement
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des engagements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paroissien</TableHead>
                <TableHead>Dime</TableHead>
                <TableHead>Cotisation</TableHead>
                <TableHead>Recu Dime</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engagements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Aucun engagement
                  </TableCell>
                </TableRow>
              ) : (
                engagements.map((eng) => {
                  const dime = Number(eng.dime)
                  const progress = dime > 0
                    ? Math.round((Number(eng.availableDime) / dime) * 100)
                    : 0
                  return (
                    <TableRow key={eng.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{eng.paroissien.name}</p>
                          <p className="text-sm text-muted-foreground">{eng.paroissien.matricule}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(dime)}</TableCell>
                      <TableCell>{formatCurrency(Number(eng.cotisation))}</TableCell>
                      <TableCell>
                        <Badge variant={progress >= 100 ? "default" : progress >= 50 ? "secondary" : "destructive"}>
                          {progress}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(eng.periodeStart).getFullYear()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={"/finances/engagements/" + eng.id}>Voir</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
