import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AssociationForm } from "@/components/forms/association-form"
import { getAssociationById } from "@/server/queries/associations"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditAssociationPage({ params }: Props) {
  const { id } = await params
  const association = await getAssociationById(id)

  if (!association) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={"/associations/" + id}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier l&apos;association</h1>
          <p className="text-muted-foreground">{association.name}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <AssociationForm association={association} />
      </div>
    </div>
  )
}
