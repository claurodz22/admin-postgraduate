'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText } from 'lucide-react';

export default function MainPage() {
  const router = useRouter()

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/home-admin" },
    { title: "Registro de Usuarios Nuevos", icon: UserPlus, href: "/register-user" },
    { title: "Registro de Estudiantes", icon: GraduationCap, href: "/register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/grades" },
    { title: "Control de Pagos", icon: CreditCard, href: "/pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/request" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                router.push("/home-all");
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#e6f3ff]">
          <nav className="py-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className="flex items-center px-6 py-2 text-[#004976] gap-3"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Card className="max-w-3xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6 text-center">
              <h2 className="text-3xl font-bold text-[#004976] mb-4">
                Bienvenido, Administrador
              </h2>
              <p className="text-lg text-gray-600">
                Este es el panel de control para la gestión del Sistema de Control para PostGrados ECAT. 
                Utilice las opciones del menú para navegar por las diferentes funciones del sistema.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

