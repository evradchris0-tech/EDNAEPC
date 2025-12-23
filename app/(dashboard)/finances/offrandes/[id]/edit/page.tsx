import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { OffrandeForm } from "@/components/forms/offrande-form"
import { getOffrandeById, getAssociationsForSelect } from "@/server/queries/finances"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditOffrandePage({ params }: Props) {
  const { id } = await params
  const [offrande, associations] = await Promise.all([
    getOffrandeById(id),
    getAssociationsForSelect(),
  ])

  if (!offrande) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={"/finances/offrandes/" + id}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier l&apos;offrande</h1>
          <p className="text-muted-foreground">
            {offrande.association.name}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <OffrandeForm offrande={offrande} associations={associations} />
      </div>
    </div>
  )
}
