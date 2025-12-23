"use client"

import { useRouter } from "next/navigation"
import { DeleteDialog } from "./delete-dialog"
import { deleteParoissien } from "@/server/actions/paroissiens"
import { deleteAssociation } from "@/server/actions/associations"
import { deleteEngagement, deleteVersement, deleteOffrande } from "@/server/actions/finances"

interface DeleteButtonProps {
  id: string
  redirectTo?: string
}

export function DeleteParoissienButton({ id, redirectTo = "/paroissiens" }: DeleteButtonProps) {
  const router = useRouter()

  return (
    <DeleteDialog
      title="Supprimer ce paroissien ?"
      description="Le paroissien sera desactive et n'apparaitra plus dans les listes. Cette action peut etre inversee."
      onDelete={() => deleteParoissien(id)}
      onSuccess={() => router.push(redirectTo)}
    />
  )
}

export function DeleteAssociationButton({ id, redirectTo = "/associations" }: DeleteButtonProps) {
  const router = useRouter()

  return (
    <DeleteDialog
      title="Supprimer cette association ?"
      description="L'association sera desactivee et n'apparaitra plus dans les listes. Cette action peut etre inversee."
      onDelete={() => deleteAssociation(id)}
      onSuccess={() => router.push(redirectTo)}
    />
  )
}

export function DeleteEngagementButton({ id, redirectTo = "/finances/engagements" }: DeleteButtonProps) {
  const router = useRouter()

  return (
    <DeleteDialog
      title="Supprimer cet engagement ?"
      description="L'engagement et toutes ses donnees seront supprimes definitivement. Cette action est irreversible."
      onDelete={() => deleteEngagement(id)}
      onSuccess={() => router.push(redirectTo)}
    />
  )
}

export function DeleteVersementButton({ id, redirectTo = "/finances/versements" }: DeleteButtonProps) {
  const router = useRouter()

  return (
    <DeleteDialog
      title="Supprimer ce versement ?"
      description="Le versement sera supprime definitivement. Les montants lies a l'engagement ne seront pas automatiquement mis a jour."
      onDelete={() => deleteVersement(id)}
      onSuccess={() => router.push(redirectTo)}
    />
  )
}

export function DeleteOffrandeButton({ id, redirectTo = "/finances/offrandes" }: DeleteButtonProps) {
  const router = useRouter()

  return (
    <DeleteDialog
      title="Supprimer cette offrande ?"
      description="L'offrande sera supprimee definitivement. Cette action est irreversible."
      onDelete={() => deleteOffrande(id)}
      onSuccess={() => router.push(redirectTo)}
    />
  )
}
