"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ClipboardList, BookOpen, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios";

export default function MisDatos() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // Redirige al login si no hay token
        router.push("/p-login-profe");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/user-info/", {
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token al header4
          },
        });

        // funciona pero no es la solucion adecuada segun cristian
        if (response.data.tipo_usuario == 1 || response.data.tipo_usuario == 2){
          router.push("/home-all");
          localStorage.removeItem("token")
        return;
        }
        
        setUserData(response.data); // Actualiza el estado con los datos del usuario
        const cedula = response.data.cedula_usuario;
        console.log(cedula);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        // Redirige al login si ocurre un error no autorizado
        if (error.response && error.response.status === 401) {
          //localStorage.removeItem("token");
          //router.push("/p-login-profe");
        }
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchUserData();
  }, [router]);

  const menuItems = [
    { title: "Inicio", icon: FileText, href: "/p-home-profe" },
    { title: "Crear Planificación", icon: FileText, href: "/p-crear-planificacion" },
    { title: "Cargar Notas", icon: ClipboardList, href: "/p-cargar-notas" },
    { title: "Listar Materias Asignadas", icon: BookOpen, href: "/p-listar-materias" },
    { title: "Mis Datos", icon: User, href: "/p-datos-profe" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
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
               Bienvenido, PROFESOR: {userData.nombre} {userData.apellido}
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
        </ul>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#004976]">Mis Datos Personales</CardTitle>
          </CardHeader>
          <CardContent>
            {userData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <User className="h-24 w-24 text-[#004976]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-600">CI del Profesor:</p>
                    <p>{userData.cedula}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Nombre:</p>
                    <p>{userData.nombre}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Apellido:</p>
                    <p>{userData.apellido}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Rol en la App Web:</p>
                    <p>{userData.tipo_usuario === 3 ? "Profesor" : "Otro"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Correo:</p>
                    <p>{userData.correo || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Código de Maestría:</p>
                    <p>{userData.codigo_maestria || "No especificado"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600">No se pudo cargar la información del usuario.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

