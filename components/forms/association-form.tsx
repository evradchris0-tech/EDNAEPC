"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createAssociation, updateAssociation } from "@/server/actions/associations"
import type { AssociationWithMembers } from "@/server/queries/associations"

interface AssociationFormProps {
  association?: AssociationWithMembers
}

export function AssociationForm({ association }: AssociationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!association

  const [formData, setFormData] = useState({
    name: association?.name || "",
    sigle: association?.sigle || "",
    description: association?.description || "",
    isActive: association?.isActive ?? true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = isEditing
        ? await updateAssociation({ ...formData, id: association.id })
        : await createAssociation(formData)

      if (!result.success) {
        setError(result.error || "Une erreur est survenue")
        toast.error(result.error || "Erreur lors de l'operation")
        return
      }
      toast.success(isEditing ? "Association mise a jour" : "Association creee avec succes")
      router.push("/associations")
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
          <Label htmlFor="name">Nom de l&apos;association *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Chorale, Jeunesse, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sigle">Sigle (optionnel)</Label>
          <Input
            id="sigle"
            value={formData.sigle}
            onChange={(e) => setFormData(prev => ({ ...prev, sigle: e.target.value }))}
            placeholder="JEP, UFEC, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optionnel)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Decrivez l'association..."
            rows={4}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="isActive">Association active</Label>
            <p className="text-sm text-muted-foreground">
              Les associations inactives ne sont pas affichees dans les listes
            </p>
          </div>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Mettre a jour" : "Creer l'association"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
