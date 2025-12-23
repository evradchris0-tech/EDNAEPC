"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ParoissienWithAssociations } from "@/server/queries/paroissiens"

const categorieColors: Record<string, string> = {
  ANCIEN: "bg-purple-500/10 text-purple-600",
  DIACRE: "bg-blue-500/10 text-blue-600",
  FIDELE: "bg-gray-500/10 text-gray-600",
}

const categorieLabels: Record<string, string> = {
  ANCIEN: "Ancien",
  DIACRE: "Diacre",
  FIDELE: "Fidele",
}

export const columns: ColumnDef<ParoissienWithAssociations>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tout selectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "matricule",
    header: "Matricule",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("matricule")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "categorie",
    header: "Categorie",
    cell: ({ row }) => {
      const categorie = row.getValue("categorie") as string
      return (
        <Badge variant="secondary" className={categorieColors[categorie]}>
          {categorieLabels[categorie]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Telephone",
    cell: ({ row }) => row.getValue("phone") || "-",
  },
  {
    accessorKey: "associations",
    header: "Associations",
    cell: ({ row }) => {
      const associations = row.original.associations
      if (!associations?.length) return "-"
      
      const primary = associations.find((a) => a.isPrimary)
      const others = associations.filter((a) => !a.isPrimary)
      
      return (
        <div className="flex flex-wrap gap-1">
          {primary && (
            <Badge variant="default" className="text-xs">
              {primary.association.sigle || primary.association.name}
            </Badge>
          )}
          {others.slice(0, 2).map((a) => (
            <Badge key={a.association.id} variant="outline" className="text-xs">
              {a.association.sigle || a.association.name}
            </Badge>
          ))}
          {others.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{others.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const paroissien = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={"/paroissiens/" + paroissien.id}>
                <Eye className="mr-2 h-4 w-4" />
                Voir
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/paroissiens/" + paroissien.id + "/edit"}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
