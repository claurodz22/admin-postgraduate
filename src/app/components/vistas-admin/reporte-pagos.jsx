"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { urls } from "../urls"

export default function ControlPagos() {
  const router = useRouter()
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/a-login-admin")
    }
  }, [router])

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(urls.pagos, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Estructura de datos recibidos:", JSON.stringify(data, null, 2))
        console.log("Primer pago:", data[0])
        setPayments(data)
      } catch (err) {
        setError(`Error al cargar los pagos: ${err.message}`)
        console.error("Error fetching payments:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" }, 
    {title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ]

  console.log("Estado actual de payments:", payments)

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
                localStorage.removeItem("token")
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                router.push("/home-all")
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* menu izquierdo de la pag*/}
        <aside className="w-64 bg-[#e6f3ff]">
          <nav className="py-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={item.title}>
                  <Link href={item.href} className="flex items-center px-6 py-2 text-[#004976] gap-3">
                    <item.icon className="h-5 w-5 shrink-0" />

                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* cuerpo principal de la pag */}
        <main className="flex-1 p-6">
          <Card className="mx-auto ">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Últimos Pagos Ingresados</h2>
              {isLoading ? (
                <p className="text-center">Cargando pagos...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha del Pago</TableHead>
                        <TableHead>Banco</TableHead>
                        <TableHead>Número de Referencia</TableHead>
                        <TableHead>Cédula</TableHead>
                        <TableHead>Nombre Estudiante</TableHead>
                        <TableHead>Apellido Estudiante</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead>Estado del Pago</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.slice(0, 25).map((payment, index) => (
                        <TableRow key={payment.numero_referencia || `payment-${index}`}>
                          <TableCell>
                            {payment.fecha_pago ? new Date(payment.fecha_pago).toLocaleDateString("es-VE") : "N/A"}
                          </TableCell>
                          <TableCell>{payment.banco_pago || "N/A"}</TableCell>
                          <TableCell>{payment.numero_referencia || "N/A"}</TableCell>
                          <TableCell>{payment.cedula_responsable || "N/A"}</TableCell>
                          <TableCell>{payment.nombre_estudiante || "N/A"}</TableCell>
                          <TableCell>{payment.apellido_estudiante || "N/A"}</TableCell>
                          <TableCell className="text-right">
                            {typeof payment.monto_pago === "number" ? `${(payment.monto_pago).toFixed(2)} Bs.` : "N/A"}
                          </TableCell>
                          <TableCell
                           
                            
                          >
                            <div
                             className="font-medium text-center"
                             style={{
                               borderRadius: "4px",
                               padding: "0px", // Reduce el espacio interno
                               fontSize: "0.8rem", // Hace el texto más compacto
                               transition: "all 0.2s ease-in-out",
                               boxShadow:
                                 payment.estado_pago === "Pendiente"
                                   ? "0 1px 2px rgba(234, 179, 8, 0.2)"
                                   : payment.estado_pago === "Confirmado"
                                   ? "0 1px 2px rgba(34, 197, 94, 0.2)"
                                   : payment.estado_pago === "Negado"
                                   ? "0 1px 2px rgba(239, 68, 68, 0.2)"
                                   : "none",
                               border:
                                 payment.estado_pago === "Pendiente"
                                   ? "1px solid rgba(234, 179, 8, 0.5)"
                                   : payment.estado_pago === "Confirmado"
                                   ? "1px solid rgba(34, 197, 94, 0.5)"
                                   : payment.estado_pago === "Negado"
                                   ? "1px solid rgba(239, 68, 68, 0.5)"
                                   : "none",
                               color:
                                 payment.estado_pago === "Pendiente"
                                   ? "rgb(161, 98, 7)"
                                   : payment.estado_pago === "Confirmado"
                                   ? "rgb(21, 128, 61)"
                                   : payment.estado_pago === "Negado"
                                   ? "rgb(185, 28, 28)"
                                   : "inherit",
                               backgroundColor:
                                 payment.estado_pago === "Pendiente"
                                   ? "rgba(234, 179, 8, 0.05)" // Más claro para que no resalte tanto
                                   : payment.estado_pago === "Confirmado"
                                   ? "rgba(34, 197, 94, 0.05)"
                                   : payment.estado_pago === "Negado"
                                   ? "rgba(239, 68, 68, 0.05)"
                                   : "transparent",
                             }}
                            >
                            {payment.estado_pago || "N/A"}
                            </div>
                          </TableCell>
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
  )
}

