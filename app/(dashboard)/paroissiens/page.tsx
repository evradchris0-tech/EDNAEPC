import Link from "next/link"
import { Plus, Download, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable, type FilterConfig } from "@/components/shared/data-table"
import { columns } from "./columns"
import { getParoissiens } from "@/server/queries/paroissiens"

export const metadata = {
  title: "Paroissiens",
  description: "Gestion des paroissiens de l'eglise",
}

const paroissienFilters: FilterConfig[] = [
  {
    columnId: "categorie",
    label: "Categorie",
    options: [
      { value: "ANCIEN", label: "Ancien" },
      { value: "DIACRE", label: "Diacre" },
      { value: "FIDELE", label: "Fidele" },
    ],
  },
]

export default async function ParoissiensPage() {
  const result = await getParoissiens({
    page: 1,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paroissiens</h1>
          <p className="text-muted-foreground">
            {result.meta.total} paroissien(s) au total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button asChild>
            <Link href="/paroissiens/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau paroissien
            </Link>
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={result.data}
        searchKey="name"
        searchPlaceholder="Rechercher par nom..."
        filters={paroissienFilters}
      />
    </div>
  )
}
