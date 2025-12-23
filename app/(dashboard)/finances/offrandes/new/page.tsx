import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { OffrandeForm } from "@/components/forms/offrande-form"
import { getAssociationsForSelect } from "@/server/queries/finances"

export const metadata = { title: "Nouvelle offrande" }

export default async function NewOffrandePage() {
  const associations = await getAssociationsForSelect()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/finances/offrandes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouvelle offrande</h1>
          <p className="text-muted-foreground">
            Enregistrer une offrande d&apos;association
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <OffrandeForm associations={associations} />
      </div>
    </div>
  )
}
