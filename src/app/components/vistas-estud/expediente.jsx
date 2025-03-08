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
  Upload,
  FileCheck,
  FilePlus,
  AlertCircle,
} from "lucide-react"
import axios from "axios"

export default function Expediente() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [solicitudEnviada, setSolicitudEnviada] = useState(false)
  const [observaciones, setObservaciones] = useState("")
  const [documentos, setDocumentos] = useState([])
  const [error, setError] = useState("")

  // Datos de ejemplo - Reemplazar con datos reales de la API
  const estadoExpediente = {
    completo: false,
    fechaUltimaActualizacion: "2023-08-15",
    observaciones: "Faltan documentos obligatorios para completar el expediente.",
  }

  const documentosRequeridos = [
    {
      id: 1,
      nombre: "Cédula de Identidad",
      estado: "ENTREGADO",
      obligatorio: true,
      fechaEntrega: "2023-05-10",
    },
    {
      id: 2,
      nombre: "Título de Bachiller",
      estado: "ENTREGADO",
      obligatorio: true,
      fechaEntrega: "2023-05-10",
    },
    {
      id: 3,
      nombre: "Notas Certificadas de Bachillerato",
      estado: "PENDIENTE",
      obligatorio: true,
      fechaEntrega: null,
    },
    {
      id: 4,
      nombre: "Partida de Nacimiento",
      estado: "ENTREGADO",
      obligatorio: true,
      fechaEntrega: "2023-05-10",
    },
    {
      id: 5,
      nombre: "Certificado Médico",
      estado: "PENDIENTE",
      obligatorio: true,
      fechaEntrega: null,
    },
    {
      id: 6,
      nombre: "Fotografías",
      estado: "PENDIENTE",
      obligatorio: true,
      fechaEntrega: null,
    },
    {
      id: 7,
      nombre: "Constancia de Servicio Comunitario",
      estado: "NO_APLICA",
      obligatorio: false,
      fechaEntrega: null,
    },
  ]

  const historialSolicitudes = [
    {
      id: 1,
      tipo: "Elaboración de Expediente",
      fecha: "2023-05-10",
      estado: "PROCESADA",
      respuesta: "Se ha creado su expediente. Faltan documentos por entregar.",
    },
  ]

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

      // Aquí se cargarían también los datos del expediente
      // Ejemplo:
      // const expedienteResponse = await axios.get("http://localhost:8000/api/expediente/", {...})

      // Inicializar documentos con los requeridos
      setDocumentos(documentosRequeridos.filter((doc) => doc.estado === "PENDIENTE"))
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

  const handleFileChange = (docId, e) => {
    const file = e.target.files[0]
    if (file) {
      setDocumentos((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...doc, archivo: file, nombreArchivo: file.name } : doc)),
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const documentosSinArchivo = documentos.filter((doc) => !doc.archivo)
    if (documentosSinArchivo.length > 0) {
      setError(`Debe cargar todos los documentos pendientes: ${documentosSinArchivo.map((d) => d.nombre).join(", ")}`)
      return
    }

    setError("")

    // Aquí iría la lógica para enviar la solicitud al backend
    // Ejemplo:
    // const formData = new FormData()
    // formData.append("observaciones", observaciones)
    // documentos.forEach(doc => {
    //   if (doc.archivo) {
    //     formData.append(`documento_${doc.id}`, doc.archivo)
    //   }
    // })
    // formData.append("cedula", userData.cedula)

    // try {
    //   const response = await axios.post("http://localhost:8000/api/expediente/actualizar/", formData, {
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
      case "ENTREGADO":
        return <Badge variant="success">Entregado</Badge>
      case "PENDIENTE":
        return <Badge variant="destructive">Pendiente</Badge>
      case "NO_APLICA":
        return <Badge variant="outline">No Aplica</Badge>
      case "PROCESADA":
        return <Badge variant="success">Procesada</Badge>
      case "EN_PROCESO":
        return <Badge variant="outline">En Proceso</Badge>
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
          {/* Estado del Expediente */}
          <div className="md:col-span-1">
            <Card className="shadow-lg border-2 h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center text-[#004976]">Estado del Expediente</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                {estadoExpediente.completo ? (
                  <>
                    <FileCheck className="h-16 w-16 text-green-500" />
                    <Badge variant="success" className="text-md py-1 px-3">
                      Completo
                    </Badge>
                    <p className="text-center">Su expediente está completo y actualizado.</p>
                  </>
                ) : (
                  <>
                    <FilePlus className="h-16 w-16 text-amber-500" />
                    <Badge variant="outline" className="text-md py-1 px-3 border-amber-500 text-amber-500">
                      Incompleto
                    </Badge>
                    <p className="text-center font-medium">{estadoExpediente.observaciones}</p>
                  </>
                )}
                <p className="text-sm text-gray-500 text-center">
                  Última actualización: {estadoExpediente.fechaUltimaActualizacion}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Documentos Requeridos */}
          <div className="md:col-span-2">
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center text-[#004976]">Documentos Requeridos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentosRequeridos.map((documento) => (
                    <div
                      key={documento.id}
                      className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div>
                        <p className="font-medium">{documento.nombre}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getEstadoBadge(documento.estado)}
                          {documento.obligatorio && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Obligatorio</span>
                          )}
                        </div>
                        {documento.fechaEntrega && (
                          <p className="text-xs text-gray-500 mt-1">Entregado el: {documento.fechaEntrega}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Formulario para Completar Expediente */}
            {!estadoExpediente.completo && (
              <Card className="shadow-lg border-2 mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#004976]">Completar Expediente</CardTitle>
                </CardHeader>
                <CardContent>
                  {solicitudEnviada ? (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertTitle>Documentos enviados con éxito</AlertTitle>
                      <AlertDescription>
                        Sus documentos han sido recibidos y serán procesados por el departamento de Control de Estudios.
                        Recibirá una notificación cuando su expediente sea actualizado.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-4">
                        {documentos.map((documento) => (
                          <div key={documento.id} className="p-4 border rounded-lg bg-gray-50">
                            <Label htmlFor={`doc-${documento.id}`} className="font-medium">
                              {documento.nombre} {documento.obligatorio && <span className="text-red-500">*</span>}
                            </Label>
                            <div className="mt-2 flex flex-col gap-2">
                              <input
                                id={`doc-${documento.id}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(documento.id, e)}
                                className="hidden"
                                required={documento.obligatorio}
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById(`doc-${documento.id}`).click()}
                                  className="w-full"
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Cargar documento
                                </Button>
                                {documento.nombreArchivo && (
                                  <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                    {documento.nombreArchivo}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones (opcional)</Label>
                        <Textarea
                          id="observaciones"
                          placeholder="Agregue cualquier información adicional relevante..."
                          value={observaciones}
                          onChange={(e) => setObservaciones(e.target.value)}
                        />
                      </div>

                      <Button type="submit" className="w-full bg-[#004976]">
                        Enviar Documentos
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Historial de Solicitudes */}
            {historialSolicitudes.length > 0 && (
              <Card className="shadow-lg border-2 mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#004976]">Historial de Solicitudes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {historialSolicitudes.map((solicitud) => (
                      <div key={solicitud.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{solicitud.tipo}</p>
                            <p className="text-sm text-gray-500">Fecha: {solicitud.fecha}</p>
                          </div>
                          {getEstadoBadge(solicitud.estado)}
                        </div>
                        {solicitud.respuesta && (
                          <div className="mt-2 text-sm">
                            <p>
                              <span className="font-medium">Respuesta:</span> {solicitud.respuesta}
                            </p>
                          </div>
                        )}
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

