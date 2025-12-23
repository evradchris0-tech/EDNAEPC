import { z } from "zod"

/**
 * Schemas de validation pour les paroissiens
 */

// Enums correspondant au schema Prisma
export const genreEnum = z.enum(["HOMME", "FEMME"])
export const categorieEnum = z.enum(["ANCIEN", "DIACRE", "FIDELE"])
export const situationEnum = z.enum(["CELIBATAIRE", "MARIE", "VEUF", "DIVORCE"])

// Schema du formulaire (avant transformation)
export const paroissienFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  genre: genreEnum.default("HOMME"),
  categorie: categorieEnum.default("FIDELE"),
  situation: situationEnum.default("CELIBATAIRE"),
  birthdate: z.string().optional(),
  birthplace: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  schoolLevel: z.string().optional(),
  servicePlace: z.string().optional(),
  baptiseDate: z.string().optional(),
  confirmDate: z.string().optional(),
  adhesionDate: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
  associationIds: z.array(z.string()).default([]),
})

export type ParoissienFormData = z.infer<typeof paroissienFormSchema>

// Schema de creation avec transformation des dates
export const createParoissienSchema = paroissienFormSchema.transform((data) => ({
  ...data,
  birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
  baptiseDate: data.baptiseDate ? new Date(data.baptiseDate) : undefined,
  confirmDate: data.confirmDate ? new Date(data.confirmDate) : undefined,
  adhesionDate: data.adhesionDate ? new Date(data.adhesionDate) : undefined,
  email: data.email || undefined,
  phone: data.phone || undefined,
  address: data.address || undefined,
  birthplace: data.birthplace || undefined,
  schoolLevel: data.schoolLevel || undefined,
  servicePlace: data.servicePlace || undefined,
  notes: data.notes || undefined,
}))

export type CreateParoissienInput = z.infer<typeof createParoissienSchema>

// Schema de mise a jour
export const updateParoissienSchema = paroissienFormSchema.partial().extend({
  id: z.string().min(1, "ID requis"),
}).transform((data) => ({
  ...data,
  birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
  baptiseDate: data.baptiseDate ? new Date(data.baptiseDate) : undefined,
  confirmDate: data.confirmDate ? new Date(data.confirmDate) : undefined,
  adhesionDate: data.adhesionDate ? new Date(data.adhesionDate) : undefined,
}))

export type UpdateParoissienInput = z.infer<typeof updateParoissienSchema>

// Schema de filtre
export const paroissienFilterSchema = z.object({
  search: z.string().optional(),
  categorie: categorieEnum.optional(),
  genre: genreEnum.optional(),
  situation: situationEnum.optional(),
  associationId: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
})

export type ParoissienFilter = z.infer<typeof paroissienFilterSchema>
