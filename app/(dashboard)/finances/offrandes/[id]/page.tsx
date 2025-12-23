import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteOffrandeButton } from "@/components/shared/delete-buttons"
import { getOffrandeById } from "@/server/queries/finances"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Props {
  params: Promise<{ id: string }>
}

export default async function OffrandeDetailPage({ params }: Props) {
  const { id } = await params
  const offrande = await getOffrandeById(id)

  if (!offrande) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/finances/offrandes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Offrande</h1>
            <p className="text-muted-foreground">
              {offrande.association.name} - {formatDate(offrande.offrandeDay)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={"/finances/offrandes/" + id + "/edit"}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <DeleteOffrandeButton id={id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Association</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Nom</span>
              <Link
                href={"/associations/" + offrande.association.id}
                className="font-medium hover:underline"
              >
                {offrande.association.name}
              </Link>
            </div>
            {offrande.association.sigle && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sigle</span>
                <Badge variant="outline">{offrande.association.sigle}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Montant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {formatCurrency(Number(offrande.somme))}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {formatDate(offrande.offrandeDay)}
              </p>
            </div>
          </CardContent>
        </Card>

        {offrande.description && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{offrande.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
