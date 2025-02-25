"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, ClipboardList, BookOpen, User, FileDown, ChevronDown } from "lucide-react"
import axios from "axios"
import { useCallback } from "react"

export default function EstudianteHomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  const fetchUserData = async () => {
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
      const cedula = response.data.cedula_usuario
      console.log(cedula)

      if (response.data.tipo_usuario == 1 || response.data.tipo_usuario == 3) {
        router.push("/home-all")
        localStorage.removeItem("token")
        return
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error)
      if (error.response && error.response.status === 401) {
        //localStorage.removeItem("token");
        //router.push("/profesor/p-login-profe");
      }
    } finally {
      setIsLoading(false)
    }
  }

  const memoizedCallback = useCallback(fetchUserData, [])
  useEffect(() => {
    memoizedCallback()
  }, [memoizedCallback])

  const menuItems = [
    { title: "Inicio", icon: FileText, href: "/estudiantes/e-home-estudiante" },
    /*{
      title: "Ver Pesum",
      icon: FileText,
      href: "/estudiantes/e-ver-pensum",
    },*/
    { title: "Ver Notas", icon: ClipboardList, href: "/estudiantes/e-ver-notas" },
    {
      title: "Control Pago",
      icon: BookOpen,
      href: "/estudiantes/e-control-pagos",
    },
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
    <div className="min-h-screen flex flex-col">
      {/* Encabezado */}
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

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-gray-100">
        <Card className="max-w-3xl mx-auto bg-[#FFEFD5]">
          <CardContent className="p-6 text-center">
            <h2 className="text-3xl font-bold text-[#004976] mb-4">
              Bienvenido, {userData ? `${userData.nombre} ${userData.apellido}` : "Estudiante"}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Bienvenido a su panel de control. Aquí puede gestionar sus cursos, calificaciones y más.
            </p>
            {userData && (
              <div className="text-left bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">Información del Usuario:</h3>
                <p>
                  <strong>Cédula:</strong> {userData.cedula}
                </p>
                <p>
                  <strong>Nombre:</strong> {userData.nombre}
                </p>
                <p>
                  <strong>Apellido:</strong> {userData.apellido}
                </p>
                <p>
                  <strong>Correo:</strong> {userData.correo || "No especificado"}
                </p>
                <p>
                  <strong>Tipo de Usuario:</strong> {userData.tipo_usuario === 2 ? "Estudiante" : "Otro"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

