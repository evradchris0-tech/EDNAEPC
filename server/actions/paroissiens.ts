"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { generateMatricule } from "@/lib/utils"
import {
  createParoissienSchema,
  updateParoissienSchema,
  type ParoissienFormData,
} from "@/lib/validations/paroissien"
import type { ActionResponse } from "@/types"

// Type d'entrée pour la mise à jour (avec id)
type UpdateParoissienFormData = Partial<ParoissienFormData> & { id: string }

/**
 * Server Actions pour les paroissiens (CRUD)
 */

/**
 * Créer un nouveau paroissien
 */
export async function createParoissien(
  data: Partial<ParoissienFormData>
): Promise<ActionResponse<{ id: string; matricule: string }>> {
  try {
    // Validation et transformation
    const validated = createParoissienSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: "Données invalides",
        fieldErrors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    const { associationIds, ...paroissienData } = validated.data

    // Générer le matricule
    const matricule = generateMatricule("PAR")

    // Créer le paroissien avec ses associations
    const paroissien = await db.paroissien.create({
      data: {
        ...paroissienData,
        matricule,
        associations: associationIds?.length
          ? {
              create: associationIds.map((associationId, index) => ({
                associationId,
                isPrimary: index === 0,
              })),
            }
          : undefined,
      },
    })

    revalidatePath("/paroissiens")

    return {
      success: true,
      data: { id: paroissien.id, matricule: paroissien.matricule },
      message: "Paroissien créé avec succès",
    }
  } catch (error) {
    console.error("[CREATE_PAROISSIEN]", error)
    return { success: false, error: "Erreur lors de la création" }
  }
}

/**
 * Mettre à jour un paroissien
 */
export async function updateParoissien(
  data: UpdateParoissienFormData
): Promise<ActionResponse> {
  try {
    // Validation et transformation
    const validated = updateParoissienSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: "Données invalides",
        fieldErrors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    const { id, associationIds, ...paroissienData } = validated.data

    // Vérifier que le paroissien existe
    const existing = await db.paroissien.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Paroissien non trouvé" }
    }

    // Mettre à jour le paroissien
    await db.$transaction(async (tx) => {
      // Supprimer les anciennes associations si on en fournit de nouvelles
      if (associationIds !== undefined) {
        await tx.associationParoissien.deleteMany({
          where: { paroissienId: id },
        })

        // Créer les nouvelles associations
        if (associationIds.length > 0) {
          await tx.associationParoissien.createMany({
            data: associationIds.map((associationId, index) => ({
              paroissienId: id,
              associationId,
              isPrimary: index === 0,
            })),
          })
        }
      }

      // Mettre à jour le paroissien
      await tx.paroissien.update({
        where: { id },
        data: paroissienData,
      })
    })

    revalidatePath("/paroissiens")
    revalidatePath(`/paroissiens/${id}`)

    return { success: true, message: "Paroissien mis à jour avec succès" }
  } catch (error) {
    console.error("[UPDATE_PAROISSIEN]", error)
    return { success: false, error: "Erreur lors de la mise à jour" }
  }
}

/**
 * Supprimer un paroissien (soft delete)
 */
export async function deleteParoissien(id: string): Promise<ActionResponse> {
  try {
    // Vérifier que le paroissien existe
    const existing = await db.paroissien.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Paroissien non trouvé" }
    }

    // Soft delete (désactiver)
    await db.paroissien.update({
      where: { id },
      data: { isActive: false },
    })

    revalidatePath("/paroissiens")

    return { success: true, message: "Paroissien supprimé avec succès" }
  } catch (error) {
    console.error("[DELETE_PAROISSIEN]", error)
    return { success: false, error: "Erreur lors de la suppression" }
  }
}

/**
 * Restaurer un paroissien supprimé
 */
export async function restoreParoissien(id: string): Promise<ActionResponse> {
  try {
    await db.paroissien.update({
      where: { id },
      data: { isActive: true },
    })

    revalidatePath("/paroissiens")

    return { success: true, message: "Paroissien restauré avec succès" }
  } catch (error) {
    console.error("[RESTORE_PAROISSIEN]", error)
    return { success: false, error: "Erreur lors de la restauration" }
  }
}

/**
 * Supprimer définitivement un paroissien
 */
export async function hardDeleteParoissien(id: string): Promise<ActionResponse> {
  try {
    await db.paroissien.delete({ where: { id } })

    revalidatePath("/paroissiens")

    return { success: true, message: "Paroissien supprimé définitivement" }
  } catch (error) {
    console.error("[HARD_DELETE_PAROISSIEN]", error)
    return { success: false, error: "Erreur lors de la suppression" }
  }
}
