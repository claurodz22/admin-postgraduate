"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { menuItems } from "../../constants/menuItemsADM"
import { Users, UserMinus } from "lucide-react"

export default function MainPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/administrador/a-login-admin")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
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
                localStorage.removeItem("token")
                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
                router.push("/home-all")
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
                  <Link href={item.href} className="flex items-center px-6 py-2 text-[#004976] gap-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Contenido principal con dos tarjetas */}
        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold text-[#004976] mb-6 text-center">Bienvenido, Administrador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#FFEFD5]">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-[#004976]" />
                <h3 className="text-2xl font-bold text-[#004976] mb-2">Listar Usuarios</h3>
                <p className="text-gray-600 mb-4">Ver la lista completa de usuarios registrados en el sistema.</p>
                <Button
                  className="bg-[#004976] text-white hover:bg-[#003357]"
                  onClick={() => router.push("/administrador/a-enlistar-usuarios")}
                >
                  Ir a Listar Usuarios
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#FFEFD5]">
              <CardContent className="p-6 text-center">
                <UserMinus className="h-12 w-12 mx-auto mb-4 text-[#004976]" />
                <h3 className="text-2xl font-bold text-[#004976] mb-2">Eliminar Usuarios</h3>
                <p className="text-gray-600 mb-4">Gestionar y eliminar usuarios del sistema.</p>
                <Button
                  className="bg-[#004976] text-white hover:bg-[#003357]"
                  onClick={() => router.push("/administrador/a-eliminate-usuarios")}
                >
                  Ir a Eliminar Usuarios
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

