'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen } from 'lucide-react';

export default function ControlNotas() {
  const router = useRouter()

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" }, 
    {title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])

  /*  
    Opciones del control de notas. El admi puede crear, habilitar un cohorte, reporte de notas (el cual pudiera filtrar
    los datos que se desean mostrar, y modificar notas)

    De las opciones, la única que cuenta con frontend es 'Creación de chohorte'
  */
  const notasOptions = [
    { title: "Creación de cohorte", description: "El administrador crea un cohorte de acuerdo a los requerimientos", href: "/a-crear-cohorte" },
    { title: "Habilitación de cohorte", description: "Habilitar o deshabilitar períodos de cohorte para ingreso de notas", href: "/habilitar-cohorte" },
    { title: "Reportes de Notas", description: "Generar reportes de notas por estudiante, asignatura o cohorte", href: "/a-reportes-notas" },
    { title: "Modificación de Notas", description: "Modificar notas existentes con autorización", href: "/modificar-notas" },
  ];

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
        {/* menu de la izquierda */}
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

        {/* contenido proncipal */}
        <main className="flex-1 p-6">
          <Card className="max-w-3xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Control de Notas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notasOptions.map((option, index) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-[#004976] mb-2">{option.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                      <Button asChild className="w-full bg-[#004976] text-white hover:bg-[#003357]">
                        <Link href={option.href}>Acceder</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

