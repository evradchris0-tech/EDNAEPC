"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import {
  createAssociationSchema,
  updateAssociationSchema,
  type AssociationFormData,
} from "@/lib/validations/association"
import type { ActionResponse } from "@/types"

// Type d'entrée pour la mise à jour (avec id)
type UpdateAssociationFormData = Partial<AssociationFormData> & { id: string }

/**
 * Server Actions pour les associations (CRUD)
 */

/**
 * Créer une nouvelle association
 */
export async function createAssociation(
  data: Partial<AssociationFormData>
): Promise<ActionResponse<{ id: string }>> {
  try {
    // Validation et transformation
    const validated = createAssociationSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: "Données invalides",
        fieldErrors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    // Créer l'association
    const association = await db.association.create({
      data: validated.data,
    })

    revalidatePath("/associations")

    return {
      success: true,
      data: { id: association.id },
      message: "Association créée avec succès",
    }
  } catch (error) {
    console.error("[CREATE_ASSOCIATION]", error)
    return { success: false, error: "Erreur lors de la création" }
  }
}

/**
 * Mettre à jour une association
 */
export async function updateAssociation(
  data: UpdateAssociationFormData
): Promise<ActionResponse> {
  try {
    // Validation et transformation
    const validated = updateAssociationSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: "Données invalides",
        fieldErrors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    const { id, ...associationData } = validated.data

    // Vérifier que l'association existe
    const existing = await db.association.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Association non trouvée" }
    }

    // Mettre à jour l'association
    await db.association.update({
      where: { id },
      data: associationData,
    })

    revalidatePath("/associations")
    revalidatePath(`/associations/${id}`)

    return { success: true, message: "Association mise à jour avec succès" }
  } catch (error) {
    console.error("[UPDATE_ASSOCIATION]", error)
    return { success: false, error: "Erreur lors de la mise à jour" }
  }
}

/**
 * Supprimer une association (soft delete)
 */
export async function deleteAssociation(id: string): Promise<ActionResponse> {
  try {
    // Vérifier que l'association existe
    const existing = await db.association.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Association non trouvée" }
    }

    // Soft delete (désactiver)
    await db.association.update({
      where: { id },
      data: { isActive: false },
    })

    revalidatePath("/associations")

    return { success: true, message: "Association supprimée avec succès" }
  } catch (error) {
    console.error("[DELETE_ASSOCIATION]", error)
    return { success: false, error: "Erreur lors de la suppression" }
  }
}

/**
 * Restaurer une association supprimée
 */
export async function restoreAssociation(id: string): Promise<ActionResponse> {
  try {
    await db.association.update({
      where: { id },
      data: { isActive: true },
    })

    revalidatePath("/associations")

    return { success: true, message: "Association restaurée avec succès" }
  } catch (error) {
    console.error("[RESTORE_ASSOCIATION]", error)
    return { success: false, error: "Erreur lors de la restauration" }
  }
}

/**
 * Supprimer définitivement une association
 */
export async function hardDeleteAssociation(id: string): Promise<ActionResponse> {
  try {
    // Vérifier qu'il n'y a pas de membres
    const membersCount = await db.associationParoissien.count({
      where: { associationId: id },
    })

    if (membersCount > 0) {
      return {
        success: false,
        error: `Impossible de supprimer: ${membersCount} membre(s) encore affilié(s)`,
      }
    }

    await db.association.delete({ where: { id } })

    revalidatePath("/associations")

    return { success: true, message: "Association supprimée définitivement" }
  } catch (error) {
    console.error("[HARD_DELETE_ASSOCIATION]", error)
    return { success: false, error: "Erreur lors de la suppression" }
  }
}

/**
 * Ajouter un membre à une association
 */
export async function addMemberToAssociation(
  associationId: string,
  paroissienId: string,
  options?: { isPrimary?: boolean; statut?: string }
): Promise<ActionResponse> {
  try {
    // Vérifier que l'affiliation n'existe pas déjà
    const existing = await db.associationParoissien.findUnique({
      where: {
        paroissienId_associationId: { paroissienId, associationId },
      },
    })

    if (existing) {
      return { success: false, error: "Ce membre est déjà affilié à cette association" }
    }

    await db.associationParoissien.create({
      data: {
        associationId,
        paroissienId,
        isPrimary: options?.isPrimary ?? false,
        statut: options?.statut,
      },
    })

    revalidatePath("/associations")
    revalidatePath(`/associations/${associationId}`)
    revalidatePath(`/paroissiens/${paroissienId}`)

    return { success: true, message: "Membre ajouté avec succès" }
  } catch (error) {
    console.error("[ADD_MEMBER_TO_ASSOCIATION]", error)
    return { success: false, error: "Erreur lors de l'ajout du membre" }
  }
}

/**
 * Retirer un membre d'une association
 */
export async function removeMemberFromAssociation(
  associationId: string,
  paroissienId: string
): Promise<ActionResponse> {
  try {
    await db.associationParoissien.delete({
      where: {
        paroissienId_associationId: { paroissienId, associationId },
      },
    })

    revalidatePath("/associations")
    revalidatePath(`/associations/${associationId}`)
    revalidatePath(`/paroissiens/${paroissienId}`)

    return { success: true, message: "Membre retiré avec succès" }
  } catch (error) {
    console.error("[REMOVE_MEMBER_FROM_ASSOCIATION]", error)
    return { success: false, error: "Erreur lors du retrait du membre" }
  }
}

/**
 * Mettre à jour le statut d'un membre dans une association
 */
export async function updateMemberStatus(
  associationId: string,
  paroissienId: string,
  statut: string | null
): Promise<ActionResponse> {
  try {
    await db.associationParoissien.update({
      where: {
        paroissienId_associationId: { paroissienId, associationId },
      },
      data: { statut },
    })

    revalidatePath(`/associations/${associationId}`)

    return { success: true, message: "Statut mis à jour avec succès" }
  } catch (error) {
    console.error("[UPDATE_MEMBER_STATUS]", error)
    return { success: false, error: "Erreur lors de la mise à jour du statut" }
  }
}
