import { AssociationForm } from "@/components/forms/association-form"

export const metadata = {
  title: "Nouvelle association",
}

export default function NewAssociationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouvelle association</h1>
        <p className="text-muted-foreground">
          Remplissez le formulaire pour creer une nouvelle association
        </p>
      </div>

      <div className="max-w-2xl">
        <AssociationForm />
      </div>
    </div>
  )
}
