import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value

  if (request.nextUrl.pathname.startsWith('/a-home-admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/a-control-notas')) {
    if (!token) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/a-control-pagos')) {
    if (!token) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/a-crear-cohorte')) {
    if (!token) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/a-register-student')) {
    if (!token) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/a-register-user')) {
    if (!token) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/a-reporte-generar-pagos')) {
    if (!token) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/a-reporte-solicitudes-estudiantiles')) {
    if (!token) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/a-solicitudes-estudiantiles')) {
    if (!token) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
  }



  return NextResponse.next()
}

export const config = {
  matcher: ['/a-home-admin/:path*'],
}

