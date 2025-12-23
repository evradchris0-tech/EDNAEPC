import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EngagementForm } from "@/components/forms/engagement-form"
import { getParoissiensForSelect } from "@/server/queries/finances"

export const metadata = { title: "Nouvel engagement" }

export default async function NewEngagementPage() {
  const paroissiens = await getParoissiensForSelect()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/finances/engagements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouvel engagement</h1>
          <p className="text-muted-foreground">
            Creer un nouvel engagement financier
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <EngagementForm paroissiens={paroissiens} />
      </div>
    </div>
  )
}
