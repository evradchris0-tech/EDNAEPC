import { notFound } from "next/navigation"
import Link from "next/link"
import { Pencil, ArrowLeft, Users, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteAssociationButton } from "@/components/shared/delete-buttons"
import { getAssociationById } from "@/server/queries/associations"
import { formatDate } from "@/lib/utils"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AssociationDetailPage({ params }: Props) {
  const { id } = await params
  const association = await getAssociationById(id)

  if (!association) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/associations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{association.name}</h1>
              {association.sigle && (
                <Badge variant="outline">{association.sigle}</Badge>
              )}
            </div>
            <Badge variant={association.isActive ? "default" : "secondary"}>
              {association.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={"/associations/" + id + "/edit"}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <DeleteAssociationButton id={id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{association.description || "Aucune description"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Membres</p>
                <p className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {association._count.paroissiens}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offrandes</p>
                <p>{association._count.offrandes}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de creation</p>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(association.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membres ({association._count.paroissiens})</CardTitle>
          </CardHeader>
          <CardContent>
            {association.paroissiens.length > 0 ? (
              <div className="space-y-2">
                {association.paroissiens.slice(0, 10).map((membre) => (
                  <div
                    key={membre.paroissien.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <Link
                        href={"/paroissiens/" + membre.paroissien.id}
                        className="font-medium hover:underline"
                      >
                        {membre.paroissien.name}
                      </Link>
                      <p className="text-sm text-muted-foreground font-mono">
                        {membre.paroissien.matricule}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {membre.isPrimary && (
                        <Badge variant="default">Principal</Badge>
                      )}
                      {membre.statut && (
                        <Badge variant="outline">{membre.statut}</Badge>
                      )}
                      <Badge variant="secondary">{membre.paroissien.categorie}</Badge>
                    </div>
                  </div>
                ))}
                {association.paroissiens.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    Et {association.paroissiens.length - 10} autre(s) membre(s)...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun membre</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
