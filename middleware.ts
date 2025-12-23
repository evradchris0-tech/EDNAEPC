import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { Role } from "@prisma/client"

/**
 * Middleware de protection des routes
 * - Redirige vers /login si non authentifié
 * - Vérifie les permissions par rôle
 * - Redirige les utilisateurs connectés qui accèdent à /login
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION DES ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Routes publiques (accessibles sans authentification)
const publicRoutes = [
  '/login',
  '/api/auth',
]

// Routes protégées par rôle spécifique
const roleProtectedRoutes: Record<string, Role[]> = {
  '/settings/users': ['SUPER_ADMIN', 'ADMIN'],
  '/settings/system': ['SUPER_ADMIN'],
}

// Routes avec restriction partielle (au moins un de ces rôles)
const financeRoutes = ['/finances', '/rapports']
const financeRoles: Role[] = ['SUPER_ADMIN', 'ADMIN', 'TRESORIER', 'GESTIONNAIRE']

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

export default auth((req) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role as Role | undefined

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // ─────────────────────────────────────────────────────────────────────────
  // CAS 1: Route publique
  // ─────────────────────────────────────────────────────────────────────────
  if (isPublicRoute) {
    // Si connecté et sur /login, rediriger vers le dashboard
    if (isLoggedIn && pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', nextUrl.origin))
    }
    return NextResponse.next()
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CAS 2: Non authentifié → Redirection vers login
  // ─────────────────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin)
    // Sauvegarder l'URL de retour (sauf pour la racine)
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CAS 3: Vérification des rôles spécifiques
  // ─────────────────────────────────────────────────────────────────────────
  if (userRole) {
    // Vérifier les routes avec protection par rôle
    for (const [route, allowedRoles] of Object.entries(roleProtectedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Accès non autorisé → Rediriger vers le dashboard
          console.warn(`[MIDDLEWARE] Accès refusé: ${userRole} → ${pathname}`)
          return NextResponse.redirect(new URL('/', nextUrl.origin))
        }
      }
    }

    // Vérifier les routes finances
    const isFinanceRoute = financeRoutes.some(route =>
      pathname.startsWith(route)
    )
    if (isFinanceRoute && !financeRoles.includes(userRole)) {
      console.warn(`[MIDDLEWARE] Accès finances refusé: ${userRole}`)
      return NextResponse.redirect(new URL('/', nextUrl.origin))
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CAS 4: Accès autorisé
  // ─────────────────────────────────────────────────────────────────────────
  return NextResponse.next()
})

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION DU MATCHER
// ═══════════════════════════════════════════════════════════════════════════

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (favicon)
     * - images dans /public
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
