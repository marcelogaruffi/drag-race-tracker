import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // O nome do cookie que definimos no auth.ts
  const cookieName = 'drag_race_user_id';
  const hasCookie = request.cookies.has(cookieName);

  // Se o usuário está tentando acessar login ou signup, e JÁ tem o cookie, joga pra Home
  if (hasCookie && (request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Se o usuário NÃO tem o cookie e está tentando acessar qualquer rota protegida
  if (!hasCookie && !request.nextUrl.pathname.startsWith('/auth') && !request.nextUrl.pathname.startsWith('/signup')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

// Configura quais rotas o middleware deve interceptar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
