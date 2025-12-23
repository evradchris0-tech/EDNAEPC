import { z } from "zod"

// Enums
export const typeVersementEnum = z.enum(["DIME", "DETTE_DIME", "DETTE_COTISATION", "OFFRANDE_CONSTRUCTION"])
export const typeCotisationEnum = z.enum(["RECOLTE", "AUTRES_RECETTES"])

// Engagement
export const createEngagementSchema = z.object({
  paroissienId: z.string().min(1, "Paroissien requis"),
  dime: z.coerce.number().min(0).default(0),
  cotisation: z.coerce.number().min(0).default(0),
  detteDime: z.coerce.number().min(0).default(0),
  detteCotisation: z.coerce.number().min(0).default(0),
  periodeStart: z.string().transform((val) => new Date(val)),
  periodeEnd: z.string().transform((val) => new Date(val)),
  notes: z.string().optional(),
})

export const updateEngagementSchema = createEngagementSchema.partial().extend({
  id: z.string().min(1),
})

export type CreateEngagementInput = z.infer<typeof createEngagementSchema>
export type UpdateEngagementInput = z.infer<typeof updateEngagementSchema>

// Versement
export const createVersementSchema = z.object({
  paroissienId: z.string().min(1, "Paroissien requis"),
  engagementId: z.string().optional(),
  type: typeVersementEnum,
  somme: z.coerce.number().min(1, "Montant requis"),
  dateVersement: z.string().transform((val) => new Date(val)),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

export const updateVersementSchema = createVersementSchema.partial().extend({
  id: z.string().min(1),
})

export type CreateVersementInput = z.infer<typeof createVersementSchema>
export type UpdateVersementInput = z.infer<typeof updateVersementSchema>

// Offrande
export const createOffrandeSchema = z.object({
  associationId: z.string().min(1, "Association requise"),
  somme: z.coerce.number().min(1, "Montant requis"),
  offrandeDay: z.string().transform((val) => new Date(val)),
  description: z.string().optional(),
})

export const updateOffrandeSchema = createOffrandeSchema.partial().extend({
  id: z.string().min(1),
})

export type CreateOffrandeInput = z.infer<typeof createOffrandeSchema>
export type UpdateOffrandeInput = z.infer<typeof updateOffrandeSchema>

// Labels
export const typeVersementLabels: Record<string, string> = {
  DIME: "Dime",
  DETTE_DIME: "Dette Dime",
  DETTE_COTISATION: "Dette Cotisation",
  OFFRANDE_CONSTRUCTION: "Offrande Construction",
}

export const typeCotisationLabels: Record<string, string> = {
  RECOLTE: "Recolte",
  AUTRES_RECETTES: "Autres Recettes",
}
