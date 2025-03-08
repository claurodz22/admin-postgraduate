"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, ClipboardList, BookOpen, User, FileDown, ChevronDown, Download, Printer } from "lucide-react"
import { menuItems, solicitudesItems } from "../../constants/menuItemsEstud";
import { format } from "date-fns"
import { es } from "date-fns/locale"
import axios from "axios"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

export default function ConstanciaInscripcion() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const constanciaRef = useRef(null)
  const currentDate = new Date()

  // Datos de ejemplo - Reemplazar con datos reales de la API
  const datosInscripcion = {
    periodo: "2023-2024",
    fechaInscripcion: "2023-09-15",
    carrera: "Ingeniería en Computación",
    semestre: "9no",
    materiasInscritas: [
      { codigo: "SIS301", nombre: "Bases de Datos", creditos: 4, seccion: "A" },
      { codigo: "SIS302", nombre: "Ingeniería de Software", creditos: 4, seccion: "B" },
      { codigo: "SIS303", nombre: "Redes de Computadoras", creditos: 3, seccion: "A" },
      { codigo: "SIS304", nombre: "Sistemas Operativos", creditos: 4, seccion: "C" },
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

  const handleDownloadPDF = async () => {
    if (!constanciaRef.current) return

    try {
      const canvas = await html2canvas(constanciaRef.current, {
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
      pdf.save(`constancia_inscripcion_${userData?.cedula || "estudiante"}.pdf`)
    } catch (error) {
      console.error("Error al generar PDF:", error)
    }
  }

  const handlePrint = () => {
    window.print()
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
        <Card className="shadow-lg border-2 mb-6 print:shadow-none print:border-0">
          <CardHeader className="print:hidden">
            <CardTitle className="text-2xl font-bold text-center text-[#004976]">Constancia de Inscripción</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={constanciaRef} className="bg-white p-8 print:p-0">
              {/* Encabezado de la constancia */}
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/Logo_UDO.svg.png"
                    alt="Logo UDO"
                    width={80}
                    height={80}
                    className="bg-white p-1 rounded-full"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-[#004976]">UNIVERSIDAD DE ORIENTE</h1>
                    <h2 className="text-lg">Núcleo de Anzoátegui</h2>
                    <h3 className="text-md">Dirección de Control de Estudios</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Fecha de emisión:</p>
                  <p>{format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                </div>
              </div>

              {/* Título de la constancia */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold uppercase">CONSTANCIA DE INSCRIPCIÓN</h2>
              </div>

              {/* Cuerpo de la constancia */}
              <div className="mb-6 text-justify">
                <p className="mb-4">
                  Por medio de la presente, la Dirección de Control de Estudios de la Universidad de Oriente, Núcleo de
                  Anzoátegui, hace constar que el ciudadano(a):
                </p>

                <div className="bg-gray-50 p-4 mb-4 border rounded-md">
                  <p className="font-semibold">
                    Nombre y Apellido:{" "}
                    <span className="font-normal">
                      {userData?.nombre} {userData?.apellido}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Cédula de Identidad: <span className="font-normal">{userData?.cedula}</span>
                  </p>
                  <p className="font-semibold">
                    Carrera: <span className="font-normal">{datosInscripcion.carrera}</span>
                  </p>
                  <p className="font-semibold">
                    Semestre: <span className="font-normal">{datosInscripcion.semestre}</span>
                  </p>
                </div>

                <p className="mb-4">
                  Se encuentra debidamente inscrito(a) para el período académico {datosInscripcion.periodo}, habiendo
                  formalizado su inscripción en fecha {datosInscripcion.fechaInscripcion}, en las siguientes
                  asignaturas:
                </p>
              </div>

              {/* Tabla de materias inscritas */}
              <div className="mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>Créditos</TableHead>
                      <TableHead>Sección</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datosInscripcion.materiasInscritas.map((materia) => (
                      <TableRow key={materia.codigo}>
                        <TableCell className="font-medium">{materia.codigo}</TableCell>
                        <TableCell>{materia.nombre}</TableCell>
                        <TableCell>{materia.creditos}</TableCell>
                        <TableCell>{materia.seccion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pie de la constancia */}
              <div className="mt-12">
                <p className="text-center mb-8">
                  Constancia que se expide a solicitud de la parte interesada en Barcelona, a los{" "}
                  {format(currentDate, "dd 'días del mes de' MMMM 'de' yyyy", { locale: es })}.
                </p>

                <div className="flex justify-center mt-16">
                  <div className="text-center border-t border-black pt-2 w-64">
                    <p className="font-semibold">Director(a) de Control de Estudios</p>
                    <p>Universidad de Oriente</p>
                    <p>Núcleo de Anzoátegui</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 print:hidden">
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

        {/* Nota para administradores */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 print:hidden">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Nota para administradores:</strong> El formato de esta constancia puede ser modificado desde el
                panel de administración. Los cambios se reflejarán automáticamente en todas las constancias generadas.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

