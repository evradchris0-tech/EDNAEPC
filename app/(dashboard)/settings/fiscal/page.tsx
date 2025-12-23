"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { YearSelector } from "@/components/shared/year-selector"
import { useFiscalYear, getAvailableYears } from "@/lib/stores/fiscal-year"
import { Badge } from "@/components/ui/badge"

export default function FiscalSettingsPage() {
  const { year, setYear } = useFiscalYear()
  const years = getAvailableYears()
  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            Periode fiscale
          </h1>
          <p className="text-muted-foreground">
            Configurez l&apos;annee fiscale en cours
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Annee fiscale active</CardTitle>
            <CardDescription>
              Selectionnez l&apos;annee pour afficher les donnees correspondantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <YearSelector className="w-full" />
            <p className="text-sm text-muted-foreground">
              Annee selectionnee: <strong>{year}</strong>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annees disponibles</CardTitle>
            <CardDescription>
              Cliquez sur une annee pour la selectionner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {years.map((y) => (
                <Button
                  key={y}
                  variant={y === year ? "default" : "outline"}
                  size="sm"
                  onClick={() => setYear(y)}
                  className="relative"
                >
                  {y}
                  {y === currentYear && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      En cours
                    </Badge>
                  )}
                  {y === year && <Check className="ml-2 h-3 w-3" />}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Le choix de l&apos;annee fiscale affecte l&apos;affichage des donnees dans les rapports et les statistiques.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
