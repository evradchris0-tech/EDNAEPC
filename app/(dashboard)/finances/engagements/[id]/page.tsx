import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteEngagementButton } from "@/components/shared/delete-buttons"
import { getEngagementById } from "@/server/queries/finances"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EngagementDetailPage({ params }: Props) {
  const { id } = await params
  const engagement = await getEngagementById(id)

  if (!engagement) {
    notFound()
  }

  const dime = Number(engagement.dime)
  const availableDime = Number(engagement.availableDime)
  const progressDime = dime > 0 ? Math.round((availableDime / dime) * 100) : 0

  const cotisation = Number(engagement.cotisation)
  const availableCotisation = Number(engagement.availableCotisation)
  const progressCotisation = cotisation > 0 ? Math.round((availableCotisation / cotisation) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/finances/engagements">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Engagement</h1>
            <p className="text-muted-foreground">
              {engagement.paroissien.name} ({engagement.paroissien.matricule})
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={"/finances/engagements/" + id + "/edit"}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <DeleteEngagementButton id={id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Periode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span>{formatDate(engagement.periodeStart)}</span>
              <span>-</span>
              <span>{formatDate(engagement.periodeEnd)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Engage:</span>
              <span className="font-bold">{formatCurrency(dime)}</span>
            </div>
            <div className="flex justify-between">
              <span>Recu:</span>
              <span className="font-bold text-green-600">{formatCurrency(availableDime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Progression:</span>
              <Badge variant={progressDime >= 100 ? "default" : progressDime >= 50 ? "secondary" : "destructive"}>
                {progressDime}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cotisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Engage:</span>
              <span className="font-bold">{formatCurrency(cotisation)}</span>
            </div>
            <div className="flex justify-between">
              <span>Recu:</span>
              <span className="font-bold text-green-600">{formatCurrency(availableCotisation)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Progression:</span>
              <Badge variant={progressCotisation >= 100 ? "default" : progressCotisation >= 50 ? "secondary" : "destructive"}>
                {progressCotisation}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dettes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Dette Dime:</span>
              <span>{formatCurrency(Number(engagement.detteDime))}</span>
            </div>
            <div className="flex justify-between">
              <span>Dette Cotisation:</span>
              <span>{formatCurrency(Number(engagement.detteCotisation))}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {engagement.versements && engagement.versements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Versements lies ({engagement.versements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {engagement.versements.map((v) => (
                <div key={v.id} className="flex justify-between py-2 border-b last:border-0">
                  <div>
                    <span className="font-medium">{v.type}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {formatDate(v.dateVersement)}
                    </span>
                  </div>
                  <span className="font-bold">{formatCurrency(Number(v.somme))}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {engagement.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{engagement.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
