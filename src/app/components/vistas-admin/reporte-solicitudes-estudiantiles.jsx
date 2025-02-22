'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react'
import { urls } from "../urls";

export default function UltimasSolicitudes() {
  const router = useRouter()
  const [studentRequests, setStudentRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch(urls.solicitudes, 
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }       
          } 
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Estructura de datos recibidos:', JSON.stringify(data, null, 2));
        console.log('Primer solicitud:', data[0]);
        setStudentRequests(data);
      } catch (err) {
        setError(`Error al cargar las solicitudes: ${err.message || String(err)}`);
        console.error('Error fetching solicitudes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col"> 
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

        <main className="flex-1 p-6">
          <Card className="mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Últimas 25 Solicitudes Estudiantiles</h2>
              {isLoading ? (
                <p>Cargando solicitudes...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código Solicitud</TableHead>
                        <TableHead>Fecha Solicitud</TableHead>
                        <TableHead>Cédula Responsable</TableHead>
                        <TableHead>Nombre Estudiante</TableHead>
                        <TableHead>Apellido Estudiante</TableHead>
                        <TableHead>Status de Solicitud</TableHead>
                        <TableHead>Tipo de Solicitud</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentRequests.slice(0, 25).map((request) => (
                        <TableRow key={request.cod_solicitudes}>
                          <TableCell>{request.cod_solicitudes}</TableCell>
                          <TableCell>{request.fecha_solicitud ? new Date(request.fecha_solicitud).toLocaleDateString('es-VE') : 'N/A'}</TableCell>
                          <TableCell>{request.cedula_responsable}</TableCell>
                          <TableCell>{request.nombre_estudiante}</TableCell>
                          <TableCell>{request.apellido_estudiante}</TableCell>
                          <TableCell>{request.status_solicitud}</TableCell>
                          <TableCell>{request.tipo_solicitud}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

