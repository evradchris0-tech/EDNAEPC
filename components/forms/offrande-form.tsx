"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createOffrande, updateOffrande } from "@/server/actions/finances"
import type { OffrandeWithAssociation } from "@/server/queries/finances"

interface OffrandeFormProps {
  offrande?: OffrandeWithAssociation
  associations: { id: string; name: string; sigle: string | null }[]
}

export function OffrandeForm({ offrande, associations }: OffrandeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!offrande

  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    associationId: offrande?.associationId || "",
    somme: offrande ? Number(offrande.somme) : 0,
    offrandeDay: offrande?.offrandeDay
      ? new Date(offrande.offrandeDay).toISOString().split("T")[0]
      : today,
    description: offrande?.description || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = isEditing
        ? await updateOffrande({ ...formData, id: offrande.id })
        : await createOffrande(formData)

      if (!result.success) {
        setError(result.error || "Une erreur est survenue")
        toast.error(result.error || "Erreur lors de l'operation")
        return
      }
      toast.success(isEditing ? "Offrande mise a jour" : "Offrande enregistree avec succes")
      router.push("/finances/offrandes")
      router.refresh()
    } catch {
      setError("Une erreur est survenue")
      toast.error("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Association *</Label>
          <Select
            value={formData.associationId}
            onValueChange={(v) => setFormData((prev) => ({ ...prev, associationId: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectionner une association" />
            </SelectTrigger>
            <SelectContent>
              {associations.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name} {a.sigle && `(${a.sigle})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="somme">Montant (FCFA) *</Label>
            <Input
              id="somme"
              type="number"
              min="1"
              value={formData.somme}
              onChange={(e) => setFormData((prev) => ({ ...prev, somme: Number(e.target.value) }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offrandeDay">Date de l&apos;offrande *</Label>
            <Input
              id="offrandeDay"
              type="date"
              value={formData.offrandeDay}
              onChange={(e) => setFormData((prev) => ({ ...prev, offrandeDay: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description de l'offrande..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Mettre a jour" : "Enregistrer l'offrande"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
