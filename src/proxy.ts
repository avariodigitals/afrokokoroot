import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-current-path', path)

  const isPublicPath = path === '/admin/login' || path === '/api/auth/login' || path === '/api/auth/logout'
  const token = request.cookies.get('admin_session')?.value || ''

  if (path.startsWith('/admin') && !isPublicPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|site.webmanifest|robots.txt|sitemap.xml|icon.png|opengraph-image.png).*)',
  ],
}