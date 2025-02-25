"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, ClipboardList, BookOpen, User, FileDown, ChevronDown } from "lucide-react"
import axios from "axios"

export default function VerPensum() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Datos de ejemplo - Reemplazar con datos reales de la API
  const pensum = {
    cicloJ: [
      {
        codigo: "J001",
        nombre: "Materia X",
        //creditos: 4,
        prerequisitos: "Ninguno",
        semestre: 1,
      },
      {
        codigo: "J002",
        nombre: "Materia X",
        //creditos: 4,
        prerequisitos: "Ninguno",
        semestre: 1,
      },
      {
        codigo: "J003",
        nombre: "Materia X",
        //creditos: 3,
        prerequisitos: "Ninguno",
        semestre: 1,
      },
    ],
    cicloGeneral: [
      {
        codigo: "G001",
        nombre: "Materia X",
        //creditos: 4,
        prerequisitos: "Materia Y",
        semestre: 2,
      },
      {
        codigo: "G002",
        nombre: "Materia X",
        //creditos: 4,
        prerequisitos: "Materia Y",
        semestre: 2,
      },
      {
        codigo: "G003",
        nombre: "Materia X",
        //creditos: 3,
        prerequisitos: "Materia Y",
        semestre: 2,
      },
    ],
    cicloProfesional: [
      {
        codigo: "P001",
        nombre: "Materia X",
        //creditos: 4,
        prerequisitos: "Materia Y",
        semestre: 3,
      },
      {
        codigo: "P002",
        nombre: "Materia X",
        //creditos: 4,
        prerequisitos: "Materia Y",
        semestre: 3,
      },
      {
        codigo: "P003",
        nombre: "Materia X",
        //creditos: 3,
        prerequisitos: "Materia Y",
        semestre: 3,
      },
    ],
  }

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/e-login-estudiante")
      return
    }

    try {
      const response = await axios.get("http://localhost:8000/api/user-info/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserData(response.data)
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        router.push("/e-login-estudiante")
      }
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const menuItems = [
    { title: "Inicio", icon: FileText, href: "/estudiantes/e-home-estudiante" },
    { title: "Ver Notas", icon: ClipboardList, href: "/estudiantes/e-ver-notas" },
    { title: "Control Pago", icon: BookOpen, href: "/estudiantes/e-control-pagos" },
    { title: "Mis Datos", icon: User, href: "/estudiantes/e-datos-estudiante" },
  ]

  const solicitudesItems = [
    { title: "Registro de Calificaciones", href: "/estudiantes/solicitudes/carta-culminacion" },
    { title: "Solvencia", href: "/estudiantes/solicitudes/solvencia" },
    { title: "Pensum", href: "/estudiantes/e-ver-pensum" },
    { title: "Constancia de Inscripción", href: "/estudiantes/solicitudes/constancia-inscripcion" },
    { title: "Elaboración de Expediente", href: "/estudiantes/solicitudes/carnet-estudiantil" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-[#004976] text-white py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
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
          <div className="flex items-center gap-4">
            {userData && (
              <span className="text-lg font-bold uppercase">
                Bienvenido, Estudiante: {userData.nombre} {userData.apellido}
              </span>
            )}
            <Button
              variant="secondary"
              className="bg-[#FFD580] text-black hover:bg-[#FFD580] hover:text-black"
              onClick={() => {
                localStorage.removeItem("token")
                router.push("/home-all")
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-[#e6f3ff] py-4">
        <ul className="container mx-auto px-6 flex justify-center space-x-8 py-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center px-4 py-2 text-[#004976] hover:bg-[#c8e1ff] rounded-md transition-all duration-300 ease-in-out"
              >
                <item.icon className="h-5 w-5 mr-2" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-4 py-2 text-[#004976] hover:bg-[#c8e1ff] rounded-md transition-all duration-300 ease-in-out">
                  <FileDown className="h-5 w-5 mr-2" />
                  <span>Solicitudes</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                {solicitudesItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center px-2 py-2 text-[#004976] hover:bg-[#e6f3ff] cursor-pointer"
                    >
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-8">
        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#004976]">Pensum de la Carrera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {Object.entries(pensum).map(([ciclo, materias]) => (
              <div key={ciclo} className="space-y-4">
                <h3 className="text-xl font-semibold text-[#004976]">
                  {ciclo === "cicloJ" ? "Ciclo J" : ciclo === "cicloGeneral" ? "Ciclo General" : "Ciclo Profesional"}
                </h3>
                <Card className="shadow-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Materia</TableHead>
                        <TableHead>Pre-requisitos</TableHead>
                        <TableHead>Semestre</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materias.map((materia) => (
                        <TableRow key={materia.codigo}>
                          <TableCell className="font-medium">{materia.codigo}</TableCell>
                          <TableCell>{materia.nombre}</TableCell>
                          <TableCell>{materia.prerequisitos}</TableCell>
                          <TableCell>{materia.semestre}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}