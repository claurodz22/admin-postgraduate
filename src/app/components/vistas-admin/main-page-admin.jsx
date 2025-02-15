'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen} from 'lucide-react';

export default function MainPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  /* Esta función se ejecuta cada vez que se recarga la página
  para verificar si hay un token en el localStorage. Si no hay,
  se redirecciona a la página de login de administradores */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/a-login-admin");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  /* elementos del menú de la izquierda con 
  su respectivo enlace de ingreso. se recuerda
  que si inicia por a- es del admin*/
  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" }, 
    { title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* encabezado */}
      <header className="bg-[#004976] text-white py-4">
        <div className="container mx-auto px-6 flex items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/Logo_UDO.svg.png"
              alt="Logo UDO"
              width={60}
              height={60}
              className="bg-white p-1 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">Universidad de Oriente</h1>
              <h2 className="text-lg">Núcleo de Anzoátegui</h2>
            </div>
          </div>
          <div className="ml-auto">
            <Button
              variant="secondary"
              className="bg-[#FFD580] text-black hover:bg-[#FFD580] hover:text-black"
              onClick={() => {
                localStorage.removeItem("token");
                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                router.push("/home-all");
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* menu con los items de arriba */}
        <aside className="w-64 bg-[#e6f3ff]">
          <nav className="py-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className="flex items-center px-6 py-2 text-[#004976] gap-3"
                  >
                    <item.icon className="h-5 w-5 shrink-0" />

                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* presentación al admi de su
        página principal */}
        <main className="flex-1 p-6">
          <Card className="max-w-3xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6 text-center">
              <h2 className="text-3xl font-bold text-[#004976] mb-4">
                Bienvenido, Administrador
              </h2>
              <p className="text-lg text-gray-600">
                bienvenido / benvenutti / welcome :)
                aqui somos poliglotas
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}