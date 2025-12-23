import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ParoissienForm } from "@/components/forms/paroissien-form"
import { getParoissienById, getAssociations } from "@/server/queries/paroissiens"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditParoissienPage({ params }: Props) {
  const { id } = await params
  const [paroissien, associations] = await Promise.all([
    getParoissienById(id),
    getAssociations(),
  ])

  if (!paroissien) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={"/paroissiens/" + id}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier le paroissien</h1>
          <p className="text-muted-foreground">{paroissien.name}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <ParoissienForm paroissien={paroissien} associations={associations} />
      </div>
    </div>
  )
}
