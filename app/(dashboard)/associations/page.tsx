import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable, type FilterConfig } from "@/components/shared/data-table"
import { columns } from "./columns"
import { getAssociations } from "@/server/queries/associations"

export const metadata = {
  title: "Associations",
  description: "Gestion des associations de l'eglise",
}

const associationFilters: FilterConfig[] = [
  {
    columnId: "isActive",
    label: "Statut",
    options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
]

export default async function AssociationsPage() {
  const result = await getAssociations({
    page: 1,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Associations</h1>
          <p className="text-muted-foreground">
            {result.meta.total} association(s) au total
          </p>
        </div>
        <Button asChild>
          <Link href="/associations/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle association
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={result.data}
        searchKey="name"
        searchPlaceholder="Rechercher par nom..."
        filters={associationFilters}
      />
    </div>
  )
}
