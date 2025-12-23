import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VersementForm } from "@/components/forms/versement-form"
import { getParoissiensForSelect, getEngagements } from "@/server/queries/finances"

export const metadata = { title: "Nouveau versement" }

export default async function NewVersementPage() {
  const [paroissiens, engagements] = await Promise.all([
    getParoissiensForSelect(),
    getEngagements(),
  ])

  const engagementsForSelect = engagements.map((e) => ({
    id: e.id,
    paroissienId: e.paroissienId,
    periodeStart: e.periodeStart,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/finances/versements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouveau versement</h1>
          <p className="text-muted-foreground">
            Enregistrer un nouveau versement
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <VersementForm paroissiens={paroissiens} engagements={engagementsForSelect} />
      </div>
    </div>
  )
}
