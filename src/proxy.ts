import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/admin/login' || path === '/api/auth/login' || path === '/api/auth/logout'
  const token = request.cookies.get('admin_session')?.value || ''

  if (path.startsWith('/admin') && !isPublicPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
  }

  if (path === '/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}