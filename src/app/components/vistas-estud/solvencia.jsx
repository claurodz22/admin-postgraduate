"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { menuItems, solicitudesItems } from "../../constants/menuItemsEstud";
import {
  FileText,
  ClipboardList,
  BookOpen,
  User,
  FileDown,
  ChevronDown,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react"
import axios from "axios"

export default function Solvencia() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [solicitudEnviada, setSolicitudEnviada] = useState(false)
  const [motivo, setMotivo] = useState("")
  const [comprobante, setComprobante] = useState(null)
  const [nombreArchivo, setNombreArchivo] = useState("")
  const [solicitudesPrevias, setSolicitudesPrevias] = useState([])
  const [error, setError] = useState("")

  // Datos de ejemplo - Reemplazar con datos reales de la API
  const estadoSolvencia = {
    solvente: false,
    motivo: "Pago pendiente del semestre actual",
    fechaUltimoPago: "2023-06-15",
    montoAdeudado: 150.0,
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

      // Aquí se cargarían también los datos de solvencia y solicitudes previas
      // Ejemplo:
      // const solvenciaResponse = await axios.get("http://localhost:8000/api/solvencia/", {...})
      // const solicitudesResponse = await axios.get("http://localhost:8000/api/solicitudes-solvencia/", {...})

      // Datos de ejemplo para solicitudes previas
      setSolicitudesPrevias([
        {
          id: 1,
          fecha: "2023-09-10",
          motivo: "Error en registro de pago",
          estado: "APROBADA",
          respuesta: "Pago verificado en sistema bancario",
        },
        {
          id: 2,
          fecha: "2023-07-05",
          motivo: "Exoneración por beca",
          estado: "RECHAZADA",
          respuesta: "No se encontró registro de beca activa",
        },
      ])
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setComprobante(file)
      setNombreArchivo(file.name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!motivo) {
      setError("Debe ingresar un motivo para la solicitud")
      return
    }

    if (!comprobante) {
      setError("Debe adjuntar un comprobante")
      return
    }

    setError("")

    // Aquí iría la lógica para enviar la solicitud al backend
    // Ejemplo:
    // const formData = new FormData()
    // formData.append("motivo", motivo)
    // formData.append("comprobante", comprobante)
    // formData.append("cedula", userData.cedula)

    // try {
    //   const response = await axios.post("http://localhost:8000/api/solicitud-solvencia/", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   })
    //   setSolicitudEnviada(true)
    // } catch (error) {
    //   setError("Error al enviar la solicitud: " + error.message)
    // }

    // Simulación de envío exitoso
    setTimeout(() => {
      setSolicitudEnviada(true)
    }, 1000)
  }

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "APROBADA":
        return (
          <Badge variant="success" className="ml-2">
            Aprobada
          </Badge>
        )
      case "RECHAZADA":
        return (
          <Badge variant="destructive" className="ml-2">
            Rechazada
          </Badge>
        )
      case "PENDIENTE":
        return (
          <Badge variant="outline" className="ml-2">
            Pendiente
          </Badge>
        )
      default:
        return null
    }
  }

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Estado de Solvencia */}
          <div className="md:col-span-1">
            <Card className="shadow-lg border-2 h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center text-[#004976]">Estado de Solvencia</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                {estadoSolvencia.solvente ? (
                  <>
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <Badge variant="success" className="text-md py-1 px-3">
                      Solvente
                    </Badge>
                    <p className="text-center">Usted se encuentra solvente con la institución.</p>
                    <p className="text-sm text-gray-500 text-center">
                      Último pago registrado: {estadoSolvencia.fechaUltimoPago}
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-16 w-16 text-red-500" />
                    <Badge variant="destructive" className="text-md py-1 px-3">
                      No Solvente
                    </Badge>
                    <p className="text-center font-medium">Motivo: {estadoSolvencia.motivo}</p>
                    <p className="text-center">Monto adeudado: ${estadoSolvencia.montoAdeudado.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 text-center">
                      Último pago registrado: {estadoSolvencia.fechaUltimoPago}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Solicitud */}
          <div className="md:col-span-2">
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center text-[#004976]">
                  Solicitud de Reactivación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {solicitudEnviada ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Solicitud enviada con éxito</AlertTitle>
                    <AlertDescription>
                      Su solicitud ha sido recibida y será procesada por el departamento correspondiente. Recibirá una
                      notificación cuando su solicitud sea revisada.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="motivo">Motivo de la solicitud</Label>
                      <Textarea
                        id="motivo"
                        placeholder="Explique el motivo por el cual solicita la reactivación de su solvencia..."
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comprobante">Comprobante de pago</Label>
                      <div className="flex flex-col gap-2">
                        <input
                          id="comprobante"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("comprobante").click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Cargar comprobante
                        </Button>
                        {nombreArchivo && (
                          <p className="text-sm text-gray-600">Archivo seleccionado: {nombreArchivo}</p>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#004976]">
                      Enviar Solicitud
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Historial de Solicitudes */}
            {solicitudesPrevias.length > 0 && (
              <Card className="shadow-lg border-2 mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#004976]">Historial de Solicitudes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {solicitudesPrevias.map((solicitud) => (
                      <div key={solicitud.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold flex items-center">
                              Solicitud #{solicitud.id}
                              {getEstadoBadge(solicitud.estado)}
                            </p>
                            <p className="text-sm text-gray-500">Fecha: {solicitud.fecha}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">
                            <span className="font-medium">Motivo:</span> {solicitud.motivo}
                          </p>
                          {solicitud.respuesta && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Respuesta:</span> {solicitud.respuesta}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

