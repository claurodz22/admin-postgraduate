"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, ClipboardList, BookOpen, User, FileDown, ChevronDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { menuItems, solicitudesItems } from "../../constants/menuItemsEstud";
import axios from "axios"

export default function VerNotas() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notas, setNotas] = useState({
    cicloJ: [
      {
        materia: "Materia 1",
        codigo: "J001",
        notas: [8, 7, 9],
        notaFinal: 8,
        estado: "APROBADO",
      },
      {
        materia: "Materia 2",
        codigo: "J002",
        notas: [6, 7, 5],
        notaFinal: 6,
        estado: "APROBADO",
      },
    ],
    cicloGeneral: [
      {
        materia: "Materia 3",
        codigo: "G001",
        notas: [7, 8, 8],
        notaFinal: 8,
        estado: "APROBADO",
      },
      {
        materia: "Materia 4",
        codigo: "G002",
        notas: [4, 5, 4],
        notaFinal: 4,
        estado: "REPROBADO",
      },
    ],
    cicloProfesional: [
      {
        materia: "Materia 5",
        codigo: "P001",
        notas: [9, 8, 9],
        notaFinal: 9,
        estado: "APROBADO",
      },
    ],
  })

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

   //EL MENU anterior

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

      {/* Menú de navegación */}
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
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center text-[#004976]">Visualizar Notas</CardTitle>
            <div className="flex justify-center gap-4">
              <Badge variant={userData?.solvente ? "success" : "destructive"}>
                Estado: {userData?.solvente ? "Solvente" : "No Solvente"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {Object.entries(notas).map(([ciclo, materias]) => (
              <div key={ciclo} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-[#004976]">
                  {ciclo === "cicloJ" ? "Ciclo J" : ciclo === "cicloGeneral" ? "Ciclo General" : "Ciclo Profesional"}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Materia</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Evaluación 1</TableHead>
                      <TableHead>Evaluación 2</TableHead>
                      <TableHead>Evaluación 3</TableHead>
                      <TableHead>Nota Final</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materias.map((materia, index) => (
                      <TableRow key={index}>
                        <TableCell>{materia.materia}</TableCell>
                        <TableCell>{materia.codigo}</TableCell>
                        {materia.notas.map((nota, i) => (
                          <TableCell key={i}>{nota}</TableCell>
                        ))}
                        <TableCell className="font-semibold">{materia.notaFinal}</TableCell>
                        <TableCell>
                          <Badge variant={materia.estado === "APROBADO" ? "success" : "destructive"}>
                            {materia.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
