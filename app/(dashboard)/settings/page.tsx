import Link from "next/link"
import { Settings, Users, Calendar, Building2, Shield } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata = { title: "Parametres" }

const settingsSections = [
  {
    title: "Gestion des utilisateurs",
    description: "Ajouter, modifier ou supprimer les utilisateurs du systeme",
    icon: Users,
    href: "/settings/users",
    disabled: false,
  },
  {
    title: "Periode fiscale",
    description: "Configurer l annee fiscale et les periodes comptables",
    icon: Calendar,
    href: "/settings/fiscal",
    disabled: false,
  },
  {
    title: "Informations de l eglise",
    description: "Nom, adresse et coordonnees de la paroisse",
    icon: Building2,
    href: "/settings/church",
    disabled: true,
  },
  {
    title: "Roles et permissions",
    description: "Gerer les roles et les droits d acces",
    icon: Shield,
    href: "/settings/roles",
    disabled: false,
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Parametres
        </h1>
        <p className="text-muted-foreground mt-1">
          Configuration du systeme de gestion
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => (
          <Card key={section.title} className={section.disabled ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {section.title}
                    {section.disabled && (
                      <Badge variant="secondary" className="text-xs">Bientot</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {section.disabled ? (
                <Button variant="outline" className="w-full" disabled>
                  Configurer
                </Button>
              ) : (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={section.href}>Configurer</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Version de l application</p>
              <p className="text-sm text-muted-foreground">Church Management System v1.0.0</p>
            </div>
            <Badge>Next.js 15</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
