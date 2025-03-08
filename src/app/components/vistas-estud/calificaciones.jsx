"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Download,
  Printer,
  AlertCircle,
  CheckCircle,
  Search,
} from "lucide-react"
import { format } from "date-fns"
import axios from "axios"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

export default function RegistroCalificaciones() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("todos")
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
  const [mostrarFormularioRevision, setMostrarFormularioRevision] = useState(false)
  const [motivoRevision, setMotivoRevision] = useState("")
  const [evaluacionRevision, setEvaluacionRevision] = useState("")
  const [solicitudEnviada, setSolicitudEnviada] = useState(false)
  const [error, setError] = useState("")
  const registroRef = useRef(null)

  // Datos de ejemplo - Reemplazar con datos reales de la API
  const calificaciones = {
    "2023-1": [
      {
        id: 1,
        codigo: "MAT101",
        nombre: "Cálculo I",
        creditos: 4,
        evaluaciones: [
          { nombre: "Parcial 1", nota: 15, porcentaje: 30 },
          { nombre: "Parcial 2", nota: 18, porcentaje: 30 },
          { nombre: "Final", nota: 16, porcentaje: 40 },
        ],
        notaFinal: 16,
        estado: "APROBADA",
      },
      {
        id: 2,
        codigo: "FIS101",
        nombre: "Física I",
        creditos: 4,
        evaluaciones: [
          { nombre: "Parcial 1", nota: 14, porcentaje: 25 },
          { nombre: "Parcial 2", nota: 12, porcentaje: 25 },
          { nombre: "Laboratorio", nota: 17, porcentaje: 20 },
          { nombre: "Final", nota: 15, porcentaje: 30 },
        ],
        notaFinal: 14,
        estado: "APROBADA",
      },
    ],
    "2022-2": [
      {
        id: 3,
        codigo: "QUI101",
        nombre: "Química General",
        creditos: 3,
        evaluaciones: [
          { nombre: "Parcial 1", nota: 10, porcentaje: 30 },
          { nombre: "Parcial 2", nota: 12, porcentaje: 30 },
          { nombre: "Final", nota: 9, porcentaje: 40 },
        ],
        notaFinal: 10,
        estado: "APROBADA",
      },
      {
        id: 4,
        codigo: "PROG101",
        nombre: "Programación I",
        creditos: 3,
        evaluaciones: [
          { nombre: "Parcial 1", nota: 8, porcentaje: 25 },
          { nombre: "Parcial 2", nota: 7, porcentaje: 25 },
          { nombre: "Proyecto", nota: 12, porcentaje: 20 },
          { nombre: "Final", nota: 9, porcentaje: 30 },
        ],
        notaFinal: 9,
        estado: "REPROBADA",
      },
    ],
  }

  const estadisticas = {
    promedioGeneral: 12.25,
    materiasAprobadas: 3,
    materiasReprobadas: 1,
    creditosAprobados: 11,
    creditosTotales: 14,
    indiceAcademico: 3.5,
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

      // Aquí se cargarían también los datos de calificaciones
      // Ejemplo:
      // const calificacionesResponse = await axios.get("http://localhost:8000/api/calificaciones/", {...})
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

  const handleDownloadPDF = async () => {
    if (!registroRef.current) return

    try {
      const canvas = await html2canvas(registroRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 20

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`registro_calificaciones_${userData?.cedula || "estudiante"}.pdf`)
    } catch (error) {
      console.error("Error al generar PDF:", error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSolicitarRevision = (materia) => {
    setMateriaSeleccionada(materia)
    setMostrarFormularioRevision(true)
    setMotivoRevision("")
    setEvaluacionRevision("")
  }

  const handleEnviarSolicitudRevision = async (e) => {
    e.preventDefault()

    if (!motivoRevision) {
      setError("Debe ingresar un motivo para la revisión")
      return
    }

    if (!evaluacionRevision) {
      setError("Debe seleccionar la evaluación a revisar")
      return
    }

    setError("")

    // Aquí iría la lógica para enviar la solicitud al backend
    // Ejemplo:
    // const solicitudData = {
    //   materiaId: materiaSeleccionada.id,
    //   evaluacion: evaluacionRevision,
    //   motivo: motivoRevision,
    //   cedula: userData.cedula
    // }

    // try {
    //   const response = await axios.post("http://localhost:8000/api/solicitud-revision/", solicitudData, {
    //     headers: {
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

  const calcularTodasMaterias = () => {
    const todas = []
    Object.keys(calificaciones).forEach((periodo) => {
      calificaciones[periodo].forEach((materia) => {
        todas.push({ ...materia, periodo })
      })
    })
    return todas
  }

  const filtrarMateriasPorPeriodo = () => {
    if (periodoSeleccionado === "todos") {
      return calcularTodasMaterias()
    } else {
      return calificaciones[periodoSeleccionado].map((materia) => ({ ...materia, periodo: periodoSeleccionado }))
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
      <header className="bg-[#004976] text-white py-4 print:hidden">
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

      <nav className="bg-[#e6f3ff] py-4 print:hidden">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Estadísticas */}
          <div className="md:col-span-1 print:hidden">
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center text-[#004976]">Estadísticas Académicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Promedio General</p>
                  <p className="text-2xl font-bold text-[#004976]">{estadisticas.promedioGeneral.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Materias Aprobadas</p>
                    <p className="text-xl font-bold text-green-600">{estadisticas.materiasAprobadas}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Materias Reprobadas</p>
                    <p className="text-xl font-bold text-red-600">{estadisticas.materiasReprobadas}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Créditos Aprobados</p>
                  <p className="text-lg font-bold">
                    {estadisticas.creditosAprobados} / {estadisticas.creditosTotales}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-[#004976] h-2.5 rounded-full"
                      style={{ width: `${(estadisticas.creditosAprobados / estadisticas.creditosTotales) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Índice Académico</p>
                  <p className="text-2xl font-bold text-[#004976]">{estadisticas.indiceAcademico.toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                <Button onClick={handleDownloadPDF} className="bg-[#004976]">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Registro de Calificaciones */}
          <div className="md:col-span-3">
            <Card className="shadow-lg border-2">
              <CardHeader className="flex flex-col md:flex-row justify-between items-center">
                <CardTitle className="text-2xl font-bold text-[#004976] print:text-center">
                  Registro de Calificaciones
                </CardTitle>
                <div className="flex items-center gap-2 mt-4 md:mt-0 print:hidden">
                  <Label htmlFor="periodo" className="whitespace-nowrap">
                    Período:
                  </Label>
                  <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                    <SelectTrigger id="periodo" className="w-[180px]">
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los períodos</SelectItem>
                      {Object.keys(calificaciones).map((periodo) => (
                        <SelectItem key={periodo} value={periodo}>
                          {periodo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div ref={registroRef}>
                  {/* Información del estudiante para impresión */}
                  <div className="hidden print:block mb-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h1 className="text-xl font-bold text-[#004976]">UNIVERSIDAD DE ORIENTE</h1>
                          <h2 className="text-lg">Núcleo de Anzoátegui</h2>
                          <h3 className="text-md">Dirección de Control de Estudios</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Fecha de emisión:</p>
                        <p>{format(new Date(), "dd/MM/yyyy")}</p>
                      </div>
                    </div>
                    <div className="my-4">
                      <h2 className="text-xl font-bold text-center mb-4">REGISTRO DE CALIFICACIONES</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <p>
                          <span className="font-semibold">Estudiante:</span> {userData?.nombre} {userData?.apellido}
                        </p>
                        <p>
                          <span className="font-semibold">Cédula:</span> {userData?.cedula}
                        </p>
                        <p>
                          <span className="font-semibold">Promedio General:</span>{" "}
                          {estadisticas.promedioGeneral.toFixed(2)}
                        </p>
                        <p>
                          <span className="font-semibold">Índice Académico:</span>{" "}
                          {estadisticas.indiceAcademico.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de calificaciones */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Asignatura</TableHead>
                        <TableHead>Créditos</TableHead>
                        <TableHead>Nota Final</TableHead>
                        <TableHead>Estado</TableHead>
                        {periodoSeleccionado === "todos" && <TableHead>Período</TableHead>}
                        <TableHead className="print:hidden">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtrarMateriasPorPeriodo().map((materia) => (
                        <TableRow key={`${materia.periodo}-${materia.id}`}>
                          <TableCell className="font-medium">{materia.codigo}</TableCell>
                          <TableCell>{materia.nombre}</TableCell>
                          <TableCell>{materia.creditos}</TableCell>
                          <TableCell className="font-semibold">{materia.notaFinal}</TableCell>
                          <TableCell>
                            <Badge variant={materia.estado === "APROBADA" ? "success" : "destructive"}>
                              {materia.estado === "APROBADA" ? "Aprobada" : "Reprobada"}
                            </Badge>
                          </TableCell>
                          {periodoSeleccionado === "todos" && <TableCell>{materia.periodo}</TableCell>}
                          <TableCell className="print:hidden">
                            <Button variant="outline" size="sm" onClick={() => handleSolicitarRevision(materia)}>
                              <Search className="h-4 w-4 mr-1" />
                              Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Modal de Detalles y Solicitud de Revisión */}
            {materiaSeleccionada && (
              <Card className="shadow-lg border-2 mt-6 print:hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#004976]">
                    Detalles de {materiaSeleccionada.nombre} ({materiaSeleccionada.codigo})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="detalles">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="detalles">Detalles de Evaluaciones</TabsTrigger>
                      <TabsTrigger value="revision">Solicitar Revisión</TabsTrigger>
                    </TabsList>
                    <TabsContent value="detalles" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Evaluación</TableHead>
                            <TableHead>Nota</TableHead>
                            <TableHead>Porcentaje</TableHead>
                            <TableHead>Ponderación</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {materiaSeleccionada.evaluaciones.map((evaluacion, index) => (
                            <TableRow key={index}>
                              <TableCell>{evaluacion.nombre}</TableCell>
                              <TableCell>{evaluacion.nota}</TableCell>
                              <TableCell>{evaluacion.porcentaje}%</TableCell>
                              <TableCell>{((evaluacion.nota * evaluacion.porcentaje) / 100).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} className="font-bold text-right">
                              Nota Final:
                            </TableCell>
                            <TableCell className="font-bold">{materiaSeleccionada.notaFinal}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TabsContent>
                    <TabsContent value="revision" className="mt-4">
                      {solicitudEnviada ? (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <AlertTitle>Solicitud enviada con éxito</AlertTitle>
                          <AlertDescription>
                            Su solicitud de revisión ha sido recibida y será procesada por el departamento
                            correspondiente. Recibirá una notificación cuando su solicitud sea atendida.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <form onSubmit={handleEnviarSolicitudRevision} className="space-y-4">
                          {error && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="evaluacion">Evaluación a revisar</Label>
                            <Select onValueChange={setEvaluacionRevision} required>
                              <SelectTrigger id="evaluacion">
                                <SelectValue placeholder="Seleccionar evaluación" />
                              </SelectTrigger>
                              <SelectContent>
                                {materiaSeleccionada.evaluaciones.map((evaluacion, index) => (
                                  <SelectItem key={index} value={evaluacion.nombre}>
                                    {evaluacion.nombre} - Nota: {evaluacion.nota}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="motivo">Motivo de la revisión</Label>
                            <Textarea
                              id="motivo"
                              placeholder="Explique detalladamente el motivo por el cual solicita la revisión..."
                              value={motivoRevision}
                              onChange={(e) => setMotivoRevision(e.target.value)}
                              className="min-h-[120px]"
                              required
                            />
                          </div>

                          <Button type="submit" className="w-full bg-[#004976]">
                            Enviar Solicitud de Revisión
                          </Button>
                        </form>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

