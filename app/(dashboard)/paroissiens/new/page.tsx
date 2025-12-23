import { ParoissienForm } from "@/components/forms/paroissien-form"
import { getAssociations } from "@/server/queries/paroissiens"

export const metadata = {
  title: "Nouveau paroissien",
}

export default async function NewParoissienPage() {
  const associations = await getAssociations()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouveau paroissien</h1>
        <p className="text-muted-foreground">
          Remplissez le formulaire pour ajouter un nouveau membre
        </p>
      </div>

      <div className="max-w-2xl">
        <ParoissienForm associations={associations} />
      </div>
    </div>
  )
}
