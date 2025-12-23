"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import {
  createEngagementSchema,
  updateEngagementSchema,
  createVersementSchema,
  updateVersementSchema,
  createOffrandeSchema,
  updateOffrandeSchema,
} from "@/lib/validations/finances"
import type { ActionResponse } from "@/types"

// Types flexibles pour les formulaires (dates en string ou Date)
type EngagementFormInput = {
  paroissienId?: string
  dime?: number
  cotisation?: number
  detteDime?: number
  detteCotisation?: number
  periodeStart?: string
  periodeEnd?: string
  notes?: string
}

type VersementFormInput = {
  paroissienId?: string
  engagementId?: string
  type?: string
  somme?: number
  dateVersement?: string
  reference?: string
  notes?: string
}

type OffrandeFormInput = {
  associationId?: string
  somme?: number
  offrandeDay?: string
  description?: string
}

// ========== ENGAGEMENTS ==========

export async function createEngagement(data: EngagementFormInput): Promise<ActionResponse<{ id: string }>> {
  try {
    const validated = createEngagementSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, error: "Donnees invalides", fieldErrors: validated.error.flatten().fieldErrors as Record<string, string[]> }
    }

    const engagement = await db.engagement.create({ data: validated.data })
    revalidatePath("/finances/engagements")
    return { success: true, data: { id: engagement.id }, message: "Engagement cree" }
  } catch (error) {
    console.error("[CREATE_ENGAGEMENT]", error)
    return { success: false, error: "Erreur lors de la creation" }
  }
}

export async function updateEngagement(data: EngagementFormInput & { id: string }): Promise<ActionResponse> {
  try {
    const validated = updateEngagementSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, error: "Donnees invalides" }
    }

    const { id, ...updateData } = validated.data
    await db.engagement.update({ where: { id }, data: updateData })
    revalidatePath("/finances/engagements")
    return { success: true, message: "Engagement mis a jour" }
  } catch (error) {
    console.error("[UPDATE_ENGAGEMENT]", error)
    return { success: false, error: "Erreur lors de la mise a jour" }
  }
}

export async function deleteEngagement(id: string): Promise<ActionResponse> {
  try {
    await db.engagement.delete({ where: { id } })
    revalidatePath("/finances/engagements")
    return { success: true, message: "Engagement supprime" }
  } catch (error) {
    console.error("[DELETE_ENGAGEMENT]", error)
    return { success: false, error: "Erreur lors de la suppression" }
  }
}

// ========== VERSEMENTS ==========

export async function createVersement(data: VersementFormInput): Promise<ActionResponse<{ id: string }>> {
  try {
    const validated = createVersementSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, error: "Donnees invalides", fieldErrors: validated.error.flatten().fieldErrors as Record<string, string[]> }
    }

    const versement = await db.versement.create({ data: validated.data })
    
    // Mettre a jour available dans engagement si lie
    if (validated.data.engagementId) {
      const field = validated.data.type === "DIME" ? "availableDime" 
        : validated.data.type === "DETTE_DIME" ? "availableDetteDime"
        : validated.data.type === "DETTE_COTISATION" ? "availableDetteCotisation"
        : null
      
      if (field) {
        await db.engagement.update({
          where: { id: validated.data.engagementId },
          data: { [field]: { increment: validated.data.somme } },
        })
      }
    }

    revalidatePath("/finances/versements")
    return { success: true, data: { id: versement.id }, message: "Versement enregistre" }
  } catch (error) {
    console.error("[CREATE_VERSEMENT]", error)
    return { success: false, error: "Erreur lors de la creation" }
  }
}

export async function updateVersement(data: VersementFormInput & { id: string }): Promise<ActionResponse> {
  try {
    const validated = updateVersementSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, error: "Donnees invalides" }
    }

    const { id, ...updateData } = validated.data
    await db.versement.update({ where: { id }, data: updateData })
    revalidatePath("/finances/versements")
    return { success: true, message: "Versement mis a jour" }
  } catch (error) {
    console.error("[UPDATE_VERSEMENT]", error)
    return { success: false, error: "Erreur lors de la mise a jour" }
  }
}

export async function deleteVersement(id: string): Promise<ActionResponse> {
  try {
    await db.versement.delete({ where: { id } })
    revalidatePath("/finances/versements")
    return { success: true, message: "Versement supprime" }
  } catch (error) {
    console.error("[DELETE_VERSEMENT]", error)
    return { success: false, error: "Erreur lors de la suppression" }
  }
}

// ========== OFFRANDES ==========

export async function createOffrande(data: OffrandeFormInput): Promise<ActionResponse<{ id: string }>> {
  try {
    const validated = createOffrandeSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, error: "Donnees invalides", fieldErrors: validated.error.flatten().fieldErrors as Record<string, string[]> }
    }

    const offrande = await db.offrande.create({ data: validated.data })
    revalidatePath("/finances/offrandes")
    return { success: true, data: { id: offrande.id }, message: "Offrande enregistree" }
  } catch (error) {
    console.error("[CREATE_OFFRANDE]", error)
    return { success: false, error: "Erreur lors de la creation" }
  }
}

export async function updateOffrande(data: OffrandeFormInput & { id: string }): Promise<ActionResponse> {
  try {
    const validated = updateOffrandeSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, error: "Donnees invalides" }
    }

    const { id, ...updateData } = validated.data
    await db.offrande.update({ where: { id }, data: updateData })
    revalidatePath("/finances/offrandes")
    return { success: true, message: "Offrande mise a jour" }
  } catch (error) {
    console.error("[UPDATE_OFFRANDE]", error)
    return { success: false, error: "Erreur lors de la mise a jour" }
  }
}

export async function deleteOffrande(id: string): Promise<ActionResponse> {
  try {
    await db.offrande.delete({ where: { id } })
    revalidatePath("/finances/offrandes")
    return { success: true, message: "Offrande supprimee" }
  } catch (error) {
    console.error("[DELETE_OFFRANDE]", error)
    return { success: false, error: "Erreur lors de la suppression" }
  }
}
