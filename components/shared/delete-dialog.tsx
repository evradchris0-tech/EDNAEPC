"use client"

import { useState } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteDialogProps {
  title?: string
  description?: string
  onDelete: () => Promise<{ success: boolean; error?: string; message?: string }>
  onSuccess?: () => void
  trigger?: React.ReactNode
  variant?: "icon" | "button" | "menuItem"
}

export function DeleteDialog({
  title = "Confirmer la suppression",
  description = "Cette action est irreversible. Voulez-vous vraiment continuer ?",
  onDelete,
  onSuccess,
  trigger,
  variant = "icon",
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await onDelete()
      if (result.success) {
        toast.success(result.message || "Suppression reussie")
        setOpen(false)
        onSuccess?.()
      } else {
        toast.error(result.error || "Erreur lors de la suppression")
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setIsDeleting(false)
    }
  }

  const defaultTrigger = variant === "icon" ? (
    <Button variant="destructive" size="icon">
      <Trash2 className="h-4 w-4" />
    </Button>
  ) : (
    <Button variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Supprimer
    </Button>
  )

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
