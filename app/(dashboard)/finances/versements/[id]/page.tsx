import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteVersementButton } from "@/components/shared/delete-buttons"
import { getVersementById } from "@/server/queries/finances"
import { formatCurrency, formatDate } from "@/lib/utils"
import { typeVersementLabels } from "@/lib/validations/finances"

interface Props {
  params: Promise<{ id: string }>
}

const typeBadgeColors: Record<string, string> = {
  DIME: "bg-green-500/10 text-green-600",
  DETTE_DIME: "bg-orange-500/10 text-orange-600",
  DETTE_COTISATION: "bg-yellow-500/10 text-yellow-600",
  OFFRANDE_CONSTRUCTION: "bg-blue-500/10 text-blue-600",
}

export default async function VersementDetailPage({ params }: Props) {
  const { id } = await params
  const versement = await getVersementById(id)

  if (!versement) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/finances/versements">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Versement</h1>
            <p className="text-muted-foreground">
              {versement.paroissien.name} - {formatDate(versement.dateVersement)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={"/finances/versements/" + id + "/edit"}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <DeleteVersementButton id={id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paroissien</span>
              <Link
                href={"/paroissiens/" + versement.paroissien.id}
                className="font-medium hover:underline"
              >
                {versement.paroissien.name}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Matricule</span>
              <span className="font-mono">{versement.paroissien.matricule}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="secondary" className={typeBadgeColors[versement.type]}>
                {typeVersementLabels[versement.type]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Montant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {formatCurrency(Number(versement.somme))}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {formatDate(versement.dateVersement)}
              </p>
            </div>
            {versement.reference && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-mono">{versement.reference}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {versement.engagement && (
          <Card>
            <CardHeader>
              <CardTitle>Engagement lie</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={"/finances/engagements/" + versement.engagement.id}
                className="text-primary hover:underline"
              >
                Voir l&apos;engagement {new Date(versement.engagement.periodeStart).getFullYear()}
              </Link>
            </CardContent>
          </Card>
        )}

        {versement.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{versement.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
