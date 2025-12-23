import { z } from "zod"

/**
 * Schemas de validation pour les associations
 */

// Schema du formulaire
export const associationFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  sigle: z.string().min(2, "Le sigle doit contenir au moins 2 caracteres").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
})

export type AssociationFormData = z.infer<typeof associationFormSchema>

// Schema de creation
export const createAssociationSchema = associationFormSchema.transform((data) => ({
  ...data,
  sigle: data.sigle || undefined,
  description: data.description || undefined,
}))

export type CreateAssociationInput = z.infer<typeof createAssociationSchema>

// Schema de mise a jour
export const updateAssociationSchema = associationFormSchema.partial().extend({
  id: z.string().min(1, "ID requis"),
}).transform((data) => ({
  ...data,
  sigle: data.sigle || undefined,
  description: data.description || undefined,
}))

export type UpdateAssociationInput = z.infer<typeof updateAssociationSchema>

// Schema de filtre
export const associationFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
})

export type AssociationFilter = z.infer<typeof associationFilterSchema>
