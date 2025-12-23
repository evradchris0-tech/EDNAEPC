import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VersementForm } from "@/components/forms/versement-form"
import { getVersementById, getParoissiensForSelect, getEngagements } from "@/server/queries/finances"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditVersementPage({ params }: Props) {
  const { id } = await params
  const [versement, paroissiens, engagements] = await Promise.all([
    getVersementById(id),
    getParoissiensForSelect(),
    getEngagements(),
  ])

  if (!versement) {
    notFound()
  }

  const engagementsForSelect = engagements.map((e) => ({
    id: e.id,
    paroissienId: e.paroissienId,
    periodeStart: e.periodeStart,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={"/finances/versements/" + id}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier le versement</h1>
          <p className="text-muted-foreground">
            {versement.paroissien.name}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <VersementForm
          versement={versement}
          paroissiens={paroissiens}
          engagements={engagementsForSelect}
        />
      </div>
    </div>
  )
}
