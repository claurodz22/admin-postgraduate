'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router  = useRouter()
  return (
    <div className="min-h-screen bg-blue-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/Logo_UDO.svg.png"
              alt="Logo"
              width={50}
              height={50}
              className="mr-4"
            />
            <h1 className="text-3xl font-bold text-gray-900">Menu Principal</h1>
          </div>
          <CardContent>
            <Button
              
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                router.push("/login");
              }}
            >
              Cerrar Sesion
            </Button>
          </CardContent>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Usuarios Nuevos</CardTitle>
                  <CardDescription>
                    Añadir nuevos usuarios al sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/register-user">Ir al Registro</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Estudiantes</CardTitle>
                  <CardDescription>
                    Gestionar la información de los estudiantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/register-student">Registrar Estudiante</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Control de Notas</CardTitle>
                  <CardDescription>
                    Revisar y actualizar calificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/grades">Ver Notas</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Control de Pagos</CardTitle>
                  <CardDescription>
                    Gestionar pagos y facturación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/pagos">Gestionar Pagos</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Solicitudes Estudiantiles</CardTitle>
                  <CardDescription>
                    Ver y procesar solicitudes de estudiantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/request">Ver Solicitudes</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
