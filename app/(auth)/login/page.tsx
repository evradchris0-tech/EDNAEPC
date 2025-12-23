import { Suspense } from "react"
import { Church } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/forms/login-form"

/**
 * Page de connexion
 * Layout centré avec formulaire de connexion
 */

export const metadata = {
  title: "Connexion | Church Management",
  description: "Connectez-vous à votre espace de gestion",
}

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Logo et titre */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Church className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">Church Management</span>
      </div>

      {/* Carte de connexion */}
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à votre espace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>

      {/* Informations de démo (à supprimer en production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p className="font-medium">Comptes de démo :</p>
          <p>admin@eglise.com / password123</p>
          <p>tresorier@eglise.com / password123</p>
        </div>
      )}

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Church Management System
      </p>
    </div>
  )
}

/**
 * Skeleton du formulaire pendant le chargement
 */
function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-10 bg-muted rounded animate-pulse" />
    </div>
  )
}
