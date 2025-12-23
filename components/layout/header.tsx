"use client"

import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { FiscalPeriodSelector } from "./fiscal-period-selector"
import { UserMenu } from "./user-menu"
import { MobileSidebar } from "./mobile-sidebar"

/**
 * Header du dashboard
 * Contient: menu mobile, sélecteur de période, menu utilisateur
 */

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Menu mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <MobileSidebar />
        </SheetContent>
      </Sheet>

      {/* Titre (optionnel) */}
      {title && (
        <>
          <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
          <Separator orientation="vertical" className="h-6 hidden md:block" />
        </>
      )}

      {/* Sélecteur de période fiscale */}
      <div className="hidden sm:flex">
        <FiscalPeriodSelector />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Menu utilisateur */}
      <UserMenu />
    </header>
  )
}
