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
import { createEngagement, updateEngagement } from "@/server/actions/finances"
import type { EngagementWithParoissien } from "@/server/queries/finances"

interface EngagementFormProps {
  engagement?: EngagementWithParoissien
  paroissiens: { id: string; name: string; matricule: string }[]
}

export function EngagementForm({ engagement, paroissiens }: EngagementFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!engagement

  const currentYear = new Date().getFullYear()
  const defaultStart = new Date(currentYear, 0, 1).toISOString().split("T")[0]
  const defaultEnd = new Date(currentYear, 11, 31).toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    paroissienId: engagement?.paroissienId || "",
    dime: engagement ? Number(engagement.dime) : 0,
    cotisation: engagement ? Number(engagement.cotisation) : 0,
    detteDime: engagement ? Number(engagement.detteDime) : 0,
    detteCotisation: engagement ? Number(engagement.detteCotisation) : 0,
    periodeStart: engagement?.periodeStart
      ? new Date(engagement.periodeStart).toISOString().split("T")[0]
      : defaultStart,
    periodeEnd: engagement?.periodeEnd
      ? new Date(engagement.periodeEnd).toISOString().split("T")[0]
      : defaultEnd,
    notes: engagement?.notes || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = isEditing
        ? await updateEngagement({ ...formData, id: engagement.id })
        : await createEngagement(formData)

      if (!result.success) {
        setError(result.error || "Une erreur est survenue")
        toast.error(result.error || "Erreur lors de l'operation")
        return
      }
      toast.success(isEditing ? "Engagement mis a jour" : "Engagement cree avec succes")
      router.push("/finances/engagements")
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
            onValueChange={(v) => setFormData((prev) => ({ ...prev, paroissienId: v }))}
            disabled={isEditing}
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

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="periodeStart">Debut de periode *</Label>
            <Input
              id="periodeStart"
              type="date"
              value={formData.periodeStart}
              onChange={(e) => setFormData((prev) => ({ ...prev, periodeStart: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodeEnd">Fin de periode *</Label>
            <Input
              id="periodeEnd"
              type="date"
              value={formData.periodeEnd}
              onChange={(e) => setFormData((prev) => ({ ...prev, periodeEnd: e.target.value }))}
              required
            />
          </div>
        </div>

        <h3 className="text-lg font-medium pt-4">Montants engages</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dime">Dime (FCFA)</Label>
            <Input
              id="dime"
              type="number"
              min="0"
              value={formData.dime}
              onChange={(e) => setFormData((prev) => ({ ...prev, dime: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cotisation">Cotisation (FCFA)</Label>
            <Input
              id="cotisation"
              type="number"
              min="0"
              value={formData.cotisation}
              onChange={(e) => setFormData((prev) => ({ ...prev, cotisation: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detteDime">Dette Dime (FCFA)</Label>
            <Input
              id="detteDime"
              type="number"
              min="0"
              value={formData.detteDime}
              onChange={(e) => setFormData((prev) => ({ ...prev, detteDime: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detteCotisation">Dette Cotisation (FCFA)</Label>
            <Input
              id="detteCotisation"
              type="number"
              min="0"
              value={formData.detteCotisation}
              onChange={(e) => setFormData((prev) => ({ ...prev, detteCotisation: Number(e.target.value) }))}
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
          {isEditing ? "Mettre a jour" : "Creer l'engagement"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
