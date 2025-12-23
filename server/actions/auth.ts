"use server"

import { signIn, signOut } from "@/lib/auth"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { AuthError } from "next-auth"
import type { ActionResponse } from "@/types"

/**
 * Server Action pour la connexion
 */
export async function login(data: LoginFormData): Promise<ActionResponse> {
  try {
    // Validation des données
    const validatedData = loginSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        error: "Données invalides",
        fieldErrors: validatedData.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    // Tentative de connexion
    const result = await signIn("credentials", {
      email: validatedData.data.email,
      password: validatedData.data.password,
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }

    return { success: true, message: "Connexion réussie" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Email ou mot de passe incorrect" }
        case "AccessDenied":
          return { success: false, error: "Compte désactivé" }
        default:
          return { success: false, error: "Erreur de connexion" }
      }
    }

    // Rethrow si c'est une redirection (comportement normal d'Auth.js)
    throw error
  }
}

/**
 * Server Action pour la déconnexion
 */
export async function logout(): Promise<void> {
  await signOut({ redirect: true, redirectTo: "/login" })
}
