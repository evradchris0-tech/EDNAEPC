import { notFound } from "next/navigation"
import Link from "next/link"
import { Pencil, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteParoissienButton } from "@/components/shared/delete-buttons"
import { getParoissienById } from "@/server/queries/paroissiens"
import { formatDate } from "@/lib/utils"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ParoissienDetailPage({ params }: Props) {
  const { id } = await params
  const paroissien = await getParoissienById(id)

  if (!paroissien) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/paroissiens">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{paroissien.name}</h1>
            <p className="text-muted-foreground font-mono">{paroissien.matricule}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={"/paroissiens/" + id + "/edit"}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <DeleteParoissienButton id={id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Genre</p>
                <p>{paroissien.genre === "HOMME" ? "Homme" : "Femme"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categorie</p>
                <Badge variant="secondary">{paroissien.categorie}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Situation</p>
                <p>{paroissien.situation}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge variant={paroissien.isActive ? "default" : "destructive"}>
                  {paroissien.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Telephone</p>
              <p>{paroissien.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{paroissien.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p>{paroissien.address || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dates importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bapteme</p>
                <p>{paroissien.baptiseDate ? formatDate(paroissien.baptiseDate) : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adhesion</p>
                <p>{paroissien.adhesionDate ? formatDate(paroissien.adhesionDate) : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associations</CardTitle>
          </CardHeader>
          <CardContent>
            {paroissien.associations?.length ? (
              <div className="flex flex-wrap gap-2">
                {paroissien.associations.map((a) => (
                  <Badge key={a.association.id} variant={a.isPrimary ? "default" : "outline"}>
                    {a.association.name}
                    {a.isPrimary && " (principale)"}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune association</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
