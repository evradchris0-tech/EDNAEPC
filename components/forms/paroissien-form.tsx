"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createParoissien, updateParoissien } from "@/server/actions/paroissiens"
import type { ParoissienWithAssociations } from "@/server/queries/paroissiens"

interface ParoissienFormProps {
  paroissien?: ParoissienWithAssociations
  associations: { id: string; name: string; sigle: string | null }[]
}

export function ParoissienForm({ paroissien, associations }: ParoissienFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!paroissien

  const [formData, setFormData] = useState({
    name: paroissien?.name || "",
    genre: paroissien?.genre || "HOMME",
    categorie: paroissien?.categorie || "FIDELE",
    situation: paroissien?.situation || "CELIBATAIRE",
    phone: paroissien?.phone || "",
    email: paroissien?.email || "",
    associationIds: paroissien?.associations?.map((a) => a.association.id) || [] as string[],
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = isEditing
        ? await updateParoissien({ ...formData, id: paroissien.id })
        : await createParoissien(formData)

      if (!result.success) {
        setError(result.error || "Erreur")
        toast.error(result.error || "Erreur lors de l'operation")
        return
      }
      toast.success(isEditing ? "Paroissien mis a jour" : "Paroissien cree avec succes")
      router.push("/paroissiens")
      router.refresh()
    } catch {
      setError("Une erreur est survenue")
      toast.error("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  function toggleAssociation(id: string) {
    setFormData(prev => ({
      ...prev,
      associationIds: prev.associationIds.includes(id)
        ? prev.associationIds.filter(aid => aid !== id)
        : [...prev.associationIds, id]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations personnelles</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="NOM Prenom"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Genre</Label>
            <Select 
              value={formData.genre} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, genre: v as "HOMME" | "FEMME" }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HOMME">Homme</SelectItem>
                <SelectItem value="FEMME">Femme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telephone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+225 00 00 00 00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemple.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Categorie</Label>
            <Select 
              value={formData.categorie} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, categorie: v as "ANCIEN" | "DIACRE" | "FIDELE" }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ANCIEN">Ancien</SelectItem>
                <SelectItem value="DIACRE">Diacre</SelectItem>
                <SelectItem value="FIDELE">Fidele</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Situation matrimoniale</Label>
            <Select 
              value={formData.situation} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, situation: v as "CELIBATAIRE" | "MARIE" | "VEUF" | "DIVORCE" }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CELIBATAIRE">Celibataire</SelectItem>
                <SelectItem value="MARIE">Marie(e)</SelectItem>
                <SelectItem value="VEUF">Veuf/Veuve</SelectItem>
                <SelectItem value="DIVORCE">Divorce(e)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Associations</h3>
        <div className="grid gap-2 md:grid-cols-3">
          {associations.map((association) => (
            <div key={association.id} className="flex items-center space-x-3">
              <Checkbox
                id={association.id}
                checked={formData.associationIds.includes(association.id)}
                onCheckedChange={() => toggleAssociation(association.id)}
              />
              <Label htmlFor={association.id} className="font-normal cursor-pointer">
                {association.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Mettre a jour" : "Creer le paroissien"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
