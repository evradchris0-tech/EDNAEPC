import Link from "next/link"
import { ArrowLeft, Shield, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = { title: "Roles et permissions" }

const roles = [
  { name: "Super Admin", key: "SUPER_ADMIN", color: "bg-red-500/10 text-red-600" },
  { name: "Administrateur", key: "ADMIN", color: "bg-purple-500/10 text-purple-600" },
  { name: "Gestionnaire", key: "GESTIONNAIRE", color: "bg-blue-500/10 text-blue-600" },
  { name: "Tresorier", key: "TRESORIER", color: "bg-green-500/10 text-green-600" },
  { name: "Secretaire", key: "SECRETAIRE", color: "bg-gray-500/10 text-gray-600" },
]

const permissions = [
  { name: "Voir paroissiens", key: "view-paroissiens", roles: ["SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "TRESORIER", "SECRETAIRE"] },
  { name: "Gerer paroissiens", key: "manage-paroissiens", roles: ["SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "SECRETAIRE"] },
  { name: "Voir associations", key: "view-associations", roles: ["SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "TRESORIER", "SECRETAIRE"] },
  { name: "Gerer associations", key: "manage-associations", roles: ["SUPER_ADMIN", "ADMIN", "GESTIONNAIRE"] },
  { name: "Voir engagements", key: "view-engagements", roles: ["SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "TRESORIER"] },
  { name: "Gerer engagements", key: "manage-engagements", roles: ["SUPER_ADMIN", "ADMIN", "TRESORIER"] },
  { name: "Voir versements", key: "view-versements", roles: ["SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "TRESORIER"] },
  { name: "Gerer versements", key: "manage-versements", roles: ["SUPER_ADMIN", "ADMIN", "TRESORIER"] },
  { name: "Voir offrandes", key: "view-offrandes", roles: ["SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "TRESORIER"] },
  { name: "Gerer offrandes", key: "manage-offrandes", roles: ["SUPER_ADMIN", "ADMIN", "TRESORIER"] },
  { name: "Voir rapports", key: "view-reports", roles: ["SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "TRESORIER"] },
  { name: "Gerer systeme", key: "manage-system", roles: ["SUPER_ADMIN", "ADMIN"] },
]

export default function RolesSettingsPage() {
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
            <Shield className="h-8 w-8" />
            Roles et permissions
          </h1>
          <p className="text-muted-foreground">
            Apercu des roles et leurs permissions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matrice des permissions</CardTitle>
          <CardDescription>
            Les permissions accordees a chaque role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Permission</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.key} className="text-center min-w-[100px]">
                      <Badge variant="secondary" className={role.color}>
                        {role.name}
                      </Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm) => (
                  <TableRow key={perm.key}>
                    <TableCell className="font-medium">{perm.name}</TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.key} className="text-center">
                        {perm.roles.includes(role.key) ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            La modification des permissions sera disponible dans une prochaine version.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
