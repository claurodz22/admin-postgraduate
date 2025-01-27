import { NextResponse } from "next/server";

const prefixes = {
  admin: "/a-",
  teacher: "/p-",
  student: "/student-",
};

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Detectar el prefijo de la ruta actual
  const currentPrefix = Object.values(prefixes).find((prefix) => path.startsWith(prefix));

  // Si no hay un prefijo válido (ruta pública o desconocida), permitir el acceso
  if (!currentPrefix) {
    return NextResponse.next();
  }

  // Obtener el token desde cookies
  const token = request.cookies.get("token")?.value;

  // Si no hay token, redirigir al home general
  if (!token) {
    return NextResponse.redirect(new URL("/home-all", request.url));
  }

  try {
    // Decodificar el token para extraer el rol del usuario
    const [, payload] = token.split(".");
    const decodedPayload = JSON.parse(atob(payload));
    const userRole = Number.parseInt(decodedPayload.role);

    // Determinar el prefijo asociado al rol del usuario
    const userPrefix = {
      1: prefixes.admin, // ADMIN
      2: prefixes.student, // STUDENT
      3: prefixes.teacher, // TEACHER
    }[userRole];

    // Si el prefijo de la ruta actual no coincide con el prefijo esperado por el rol
    if (currentPrefix !== userPrefix) {
      return NextResponse.redirect(new URL("/home-all", request.url)); // Redirige a /home-all
    }

    // Permitir el acceso si todo está en orden
    return NextResponse.next();
  } catch (error) {
    console.error("Error decoding token:", error);
    // En caso de error al decodificar el token, redirigir al home general
    return NextResponse.redirect(new URL("/home-all", request.url));
  }
}

export const config = {
  matcher: ["/a-:path*", "/p-:path*", "/student-:path*"], // Rutas en las que deseas que actúe el middleware
};
