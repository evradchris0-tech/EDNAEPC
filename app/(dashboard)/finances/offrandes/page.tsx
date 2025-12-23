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
import { getOffrandes } from "@/server/queries/finances"
import { formatCurrency, formatDate } from "@/lib/utils"

export const metadata = { title: "Offrandes" }

export default async function OffrandesPage() {
  const offrandes = await getOffrandes()

  const total = offrandes.reduce((sum, o) => sum + Number(o.somme), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offrandes</h1>
          <p className="text-muted-foreground">
            {offrandes.length} offrande(s) - Total: {formatCurrency(total)}
          </p>
        </div>
        <Button asChild>
          <Link href="/finances/offrandes/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle offrande
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des offrandes des associations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Association</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offrandes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Aucune offrande
                  </TableCell>
                </TableRow>
              ) : (
                offrandes.map((off) => (
                  <TableRow key={off.id}>
                    <TableCell>{formatDate(off.offrandeDay)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {off.association.sigle || off.association.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(Number(off.somme))}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {off.description || "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={"/finances/offrandes/" + off.id}>Voir</Link>
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
