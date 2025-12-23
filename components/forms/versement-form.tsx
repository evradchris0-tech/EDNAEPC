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
import { createVersement, updateVersement } from "@/server/actions/finances"
import { typeVersementLabels } from "@/lib/validations/finances"
import type { VersementWithRelations } from "@/server/queries/finances"

interface VersementFormProps {
  versement?: VersementWithRelations
  paroissiens: { id: string; name: string; matricule: string }[]
  engagements?: { id: string; paroissienId: string; periodeStart: Date }[]
}

export function VersementForm({ versement, paroissiens, engagements = [] }: VersementFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!versement

  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    paroissienId: versement?.paroissienId || "",
    engagementId: versement?.engagementId || "",
    type: (versement?.type || "DIME") as string,
    somme: versement ? Number(versement.somme) : 0,
    dateVersement: versement?.dateVersement
      ? new Date(versement.dateVersement).toISOString().split("T")[0]
      : today,
    reference: versement?.reference || "",
    notes: versement?.notes || "",
  })

  // Filtrer les engagements pour le paroissien sélectionné
  const filteredEngagements = engagements.filter(
    (e) => e.paroissienId === formData.paroissienId
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = isEditing
        ? await updateVersement({ ...formData, id: versement.id })
        : await createVersement(formData)

      if (!result.success) {
        setError(result.error || "Une erreur est survenue")
        toast.error(result.error || "Erreur lors de l'operation")
        return
      }
      toast.success(isEditing ? "Versement mis a jour" : "Versement enregistre avec succes")
      router.push("/finances/versements")
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
          <Label>Paroissien *</Label>
          <Select
            value={formData.paroissienId}
            onValueChange={(v) => setFormData((prev) => ({ ...prev, paroissienId: v, engagementId: "" }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectionner un paroissien" />
            </SelectTrigger>
            <SelectContent>
              {paroissiens.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.matricule})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredEngagements.length > 0 && (
          <div className="space-y-2">
            <Label>Lier a un engagement (optionnel)</Label>
            <Select
              value={formData.engagementId}
              onValueChange={(v) => setFormData((prev) => ({ ...prev, engagementId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aucun engagement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {filteredEngagements.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    Engagement {new Date(e.periodeStart).getFullYear()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Type de versement *</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData((prev) => ({ ...prev, type: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(typeVersementLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="dateVersement">Date du versement *</Label>
            <Input
              id="dateVersement"
              type="date"
              value={formData.dateVersement}
              onChange={(e) => setFormData((prev) => ({ ...prev, dateVersement: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference / Recu</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
              placeholder="Numero de recu"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Notes optionnelles..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Mettre a jour" : "Enregistrer le versement"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
