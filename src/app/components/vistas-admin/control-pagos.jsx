'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { menuItems } from "../../constants/menuItemsADM"; 

export default function ControlNotas() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])

  const notasOptions = [
    { title: "Generar Reporte de Pagos", description: "Generar un reporte de todos los pagos recibidos en el sistema", href: "/administrador/a-reporte-generar-pagos" },
    { title: "Buscar Pagos por Cédula", description: "Buscar los pagos realizados por un estudiante usando su número de cédula", href: "/administrador/a-buscar-pagos-cedula" },
    { title: "Actualizar estado del pago", description: "Modificar el estado de los pagos registrados en el sistema", href: "/administrador/a-actualizar-pago" 
    }
  ];

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
                    <item.icon className="h-5 w-5 shrink-0" />

                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* cuerpo principal de la pag */ }
        <main className="flex-1 p-6">
          <Card className="max-w-3xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Control de Pagos</h2>
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

