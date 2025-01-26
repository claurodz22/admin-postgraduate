import { NextResponse } from 'next/server'

const adminRoutes = [
  '/a-home-admin',
  '/a-control-notas',
  '/a-control-pagos',
  '/a-crear-cohorte',
  '/a-register-student',
  '/a-register-user',
  '/a-reporte-generar-pagos',
  '/a-reporte-solicitudes-estudiantiles',
  '/a-solicitudes-estudiantiles'
];

const teacherRoutes = [
  '/teacher-dashboard',
  '/teacher-courses',
  '/teacher-grades'
];

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  if (!token) {
    if (adminRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/a-login-admin', request.url))
    }
    if (teacherRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Decodificar el token JWT para obtener el rol del usuario
  // Nota: En una implementación real, deberías verificar la firma del token
  try {
    const [, payload] = token.split('.')
    const decodedPayload = JSON.parse(atob(payload))
    const userRole = decodedPayload.role

    if (adminRoutes.some(route => path.startsWith(route)) && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (teacherRoutes.some(route => path.startsWith(route)) && userRole !== 'teacher') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [...adminRoutes, ...teacherRoutes].map(route => `${route}/:path*`)
}