import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EngagementForm } from "@/components/forms/engagement-form"
import { getEngagementById, getParoissiensForSelect } from "@/server/queries/finances"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditEngagementPage({ params }: Props) {
  const { id } = await params
  const [engagement, paroissiens] = await Promise.all([
    getEngagementById(id),
    getParoissiensForSelect(),
  ])

  if (!engagement) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={"/finances/engagements/" + id}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier l&apos;engagement</h1>
          <p className="text-muted-foreground">
            {engagement.paroissien.name}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <EngagementForm engagement={engagement} paroissiens={paroissiens} />
      </div>
    </div>
  )
}
