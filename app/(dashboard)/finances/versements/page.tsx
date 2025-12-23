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
import { getVersements } from "@/server/queries/finances"
import { formatCurrency, formatDate } from "@/lib/utils"
import { typeVersementLabels } from "@/lib/validations/finances"

export const metadata = { title: "Versements" }

const typeBadgeColors: Record<string, string> = {
  DIME: "bg-green-500/10 text-green-600",
  DETTE_DIME: "bg-orange-500/10 text-orange-600",
  DETTE_COTISATION: "bg-yellow-500/10 text-yellow-600",
  OFFRANDE_CONSTRUCTION: "bg-blue-500/10 text-blue-600",
}

export default async function VersementsPage() {
  const versements = await getVersements()

  const total = versements.reduce((sum, v) => sum + Number(v.somme), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Versements</h1>
          <p className="text-muted-foreground">
            {versements.length} versement(s) - Total: {formatCurrency(total)}
          </p>
        </div>
        <Button asChild>
          <Link href="/finances/versements/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau versement
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des versements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Paroissien</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Aucun versement
                  </TableCell>
                </TableRow>
              ) : (
                versements.map((vers) => (
                  <TableRow key={vers.id}>
                    <TableCell>{formatDate(vers.dateVersement)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vers.paroissien.name}</p>
                        <p className="text-sm text-muted-foreground">{vers.paroissien.matricule}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={typeBadgeColors[vers.type]}>
                        {typeVersementLabels[vers.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(Number(vers.somme))}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vers.reference || "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={"/finances/versements/" + vers.id}>Voir</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
