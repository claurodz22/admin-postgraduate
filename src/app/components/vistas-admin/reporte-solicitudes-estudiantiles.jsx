'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText } from 'lucide-react';
import { useState, useEffect } from 'react'

// Simulated student request data
const studentRequests = [
  { id: 1, code: "SOL-001", date: "2023-06-15", cedula: "V-12345678", name: "Juan Pérez", type: "Constancia de Estudios", status: "Resuelta" },
  { id: 2, code: "SOL-002", date: "2023-06-14", cedula: "V-23456789", name: "María González", type: "Cambio de Carrera", status: "En trámite" },
  { id: 3, code: "SOL-003", date: "2023-06-13", cedula: "E-34567890", name: "Carlos Rodríguez", type: "Reincorporación", status: "No resuelta" },
  { id: 4, code: "SOL-004", date: "2023-06-12", cedula: "V-45678901", name: "Ana Martínez", type: "Constancia de Notas", status: "Resuelta" },
  { id: 5, code: "SOL-005", date: "2023-06-11", cedula: "E-56789012", name: "Luis Hernández", type: "Retiro de Materia", status: "En trámite" },
  // ... add more simulated requests up to 25
];

export default function UltimasSolicitudes() {
  const router = useRouter()

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro de Usuarios Nuevos", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro de Estudiantes", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col"> 
      {/* encabezado de la pagina */}
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
        {/* menu izquierdo de la pag*/ }
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

        {/* cuerpo principal de la pag */ }
        <main className="flex-1 p-6">
          <Card className="mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Últimas 25 Solicitudes Estudiantiles</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código Solicitud</TableHead>
                      <TableHead>Fecha de Solicitud</TableHead>
                      <TableHead>Cédula del Estudiante</TableHead>
                      <TableHead>Nombre del Estudiante</TableHead>
                      <TableHead>Tipo de Solicitud</TableHead>
                      <TableHead>Status de la Solicitud</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.code}</TableCell>
                        <TableCell>{new Date(request.date).toLocaleDateString('es-VE')}</TableCell>
                        <TableCell>{request.cedula}</TableCell>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

