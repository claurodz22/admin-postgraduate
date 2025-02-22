"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen } from "lucide-react"
import { urls } from "../urls"

export default function AsignarMaterias() {
  const router = useRouter()
  const [cohorts, setCohorts] = useState([])
  const [selectedCohort, setSelectedCohort] = useState("")
  const [tipoMaestria, setTipoMaestria] = useState("")
  const [planningRows, setPlanningRows] = useState([
    {
      codigoMateria: "",
      nombreMateria: "",
      duracion: "",
      fechaInicio: "",
      fechaFin: "",
      profesor: "",
    },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [professors, setProfessors] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    fetchCohorts()
    fetchProfessors()
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCohort) {
      const tipoMaestriaCode = selectedCohort.substring(0, 2)
      switch (tipoMaestriaCode) {
        case "FI":
          setTipoMaestria("8306")
          break
        case "GG":
          setTipoMaestria("8327")
          break
        case "RH":
          setTipoMaestria("8207")
          break
        default:
          setTipoMaestria("")
      }
    } else {
      setTipoMaestria("")
    }
  }, [selectedCohort])

  const fetchCohorts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(urls.cohortes, { // cohortes/"
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes permiso para acceder a esta información. Por favor, verifica tus credenciales.")
        }
        throw new Error(`Error del servidor: ${response.status}`)
      }
      const data = await response.json()
      const validCohorts = data.filter((cohort) => cohort && cohort.codigo_cohorte)
      setCohorts(validCohorts)
    } catch (error) {
      console.error("Error fetching cohorts:", error)
      setError(error.message || "Error al cargar las cohortes. Por favor, intente de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfessors = async () => {
    try {
      const response = await fetch(urls.listado_profesores, { // listado-profesores/"
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`)
      }
      const data = await response.json()
      setProfessors(data)
    } catch (error) {
      console.error("Error fetching professors:", error)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch(urls.listado_materias, { // listado-materias/"
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`)
      }
      const data = await response.json()
      const uniqueCourses = data.reduce((acc, current) => {
        const x = acc.find((item) => item.cod_materia === current.cod_materia)
        if (!x) {
          return acc.concat([current])
        } else {
          return acc
        }
      }, [])
      setCourses(uniqueCourses)
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const handleRetry = () => {
    setRetryCount((prevCount) => prevCount + 1)
  }

  const handleAddRow = () => {
    setPlanningRows([
      ...planningRows,
      {
        codigoMateria: "",
        nombreMateria: "",
        duracion: "",
        fechaInicio: "",
        fechaFin: "",
        profesor: "",
      },
    ])
  }

  const handleRowChange = (index, field, value) => {
    const newRows = [...planningRows]
    newRows[index][field] = value

    if (field === "fechaInicio" || field === "duracion") {
      if (newRows[index].fechaInicio && newRows[index].duracion) {
        const startDate = new Date(newRows[index].fechaInicio)
        const durationWeeks = Number.parseInt(newRows[index].duracion)
        if (!isNaN(durationWeeks)) {
          const endDate = new Date(startDate.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000)
          newRows[index].fechaFin = endDate.toISOString().split("T")[0]
        }
      }
    }

    setPlanningRows(newRows)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate that all required fields are filled
    const isValid = planningRows.every(
      (row) =>
        row.codigoMateria && row.nombreMateria && row.duracion && row.fechaInicio && row.fechaFin && row.profesor,
    )

    if (!isValid) {
      setError("Por favor, complete todos los campos requeridos para cada materia.")
      return
    }

    const requestData = {
      cohort: selectedCohort,
      planning: planningRows.map((row) => ({
        cod_materia: row.codigoMateria,
        nom_materia: row.nombreMateria,
        duracion: row.duracion,
        cedula_profesor: row.profesor,
        nombre_profesor: row.profesor
          ? professors.find((p) => p.ci_profesor.toString() === row.profesor)?.nom_profesor_materia
          : "",
        apellido_profesor: row.profesor
          ? professors.find((p) => p.ci_profesor.toString() === row.profesor)?.ape_profesor_materia
          : "",
        fecha_inicio: row.fechaInicio,
        fecha_fin: row.fechaFin,
        codigo_cohorte: selectedCohort,
      })),
    }

    console.log("Datos enviados:", requestData)

    try {
      const response = await fetch(urls.asignar_profesor_materia, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          // Handle validation errors
          const errorMessages = data.errors
            .map((error) =>
              Object.entries(error)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", "),
            )
            .join("; ")
          throw new Error(`Errores de validación: ${errorMessages}`)
        } else {
          throw new Error(data.detail || `Error del servidor: ${response.status}`)
        }
      }

      console.log("Planificación guardada correctamente:", data.created)
      // Show success message
      setError(null)
      alert("Planificación guardada correctamente")
      // Optionally, clear the form or redirect
      setPlanningRows([
        {
          codigoMateria: "",
          nombreMateria: "",
          duracion: "",
          fechaInicio: "",
          fechaFin: "",
          profesor: "",
        },
      ])
      setSelectedCohort("")
    } catch (error) {
      console.error("Error al guardar planificación:", error)
      setError(error.message || "Hubo un error al guardar la planificación. Intenta de nuevo.")
    }
  }

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" },
    { title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
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
                router.push("/home-all")
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
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

        <main className="flex-1 p-6">
          <Card className="max-w-6xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Asignar Materias</h2>

              {isLoading ? (
                <div className="flex justify-center items-center">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Cargando cohortes...
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                    <Button onClick={handleRetry} variant="outline" size="sm" className="mt-2">
                      Intentar de nuevo
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="cohort">Seleccionar Cohorte</Label>
                    <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una cohorte" />
                      </SelectTrigger>
                      <SelectContent>
                        {cohorts.map((cohort) => (
                          <SelectItem key={cohort.codigo_cohorte} value={cohort.codigo_cohorte}>
                            {`${cohort.codigo_cohorte}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/6">Código Materia</TableHead>
                        <TableHead className="w-1/6">Nombre Materia</TableHead>
                        <TableHead className="w-1/6">Duración (semanas)</TableHead>
                        <TableHead className="w-1/6">Fecha Inicio</TableHead>
                        <TableHead className="w-1/6">Fecha Fin</TableHead>
                        <TableHead className="w-1/6">Profesor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {planningRows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              value={row.codigoMateria}
                              onChange={(e) => handleRowChange(index, "codigoMateria", e.target.value)}
                              readOnly
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.nombreMateria}
                              onValueChange={(value) => {
                                const selectedCourse = courses.find((course) => course.nombre_materia === value)
                                handleRowChange(index, "nombreMateria", value)
                                handleRowChange(
                                  index,
                                  "codigoMateria",
                                  selectedCourse ? selectedCourse.cod_materia : "",
                                )
                              }}
                              disabled={!tipoMaestria}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione una materia" />
                              </SelectTrigger>
                              <SelectContent>
                                {courses
                                  .filter((course) => course.cod_materia.startsWith(tipoMaestria))
                                  .map((course) => (
                                    <SelectItem
                                      key={`${course.cod_materia}-${course.nombre_materia}`}
                                      value={course.nombre_materia}
                                    >
                                      {course.nombre_materia}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={row.duracion}
                              onChange={(e) => handleRowChange(index, "duracion", e.target.value)}
                              className="w-full"
                              min="1"
                              max="52"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={row.fechaInicio}
                              onChange={(e) => {
                                const selectedDate = new Date(e.target.value)
                                const day = selectedDate.getDay()
                                if (day ===  6 || day === 5) {
                                  handleRowChange(index, "fechaInicio", e.target.value)
                                } else {
                                  alert("Por favor, seleccione sólo sábado o domingo.")
                                }
                              }}
                              className="w-full"
                              min={new Date().toISOString().split("T")[0]} // Set min date to today
                            />
                            <p className="text-xs text-gray-500 mt-1">Sólo sábado o domingo</p>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={row.fechaFin}
                              onChange={(e) => handleRowChange(index, "fechaFin", e.target.value)}
                              className="w-full"
                              readOnly
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.profesor}
                              onValueChange={(value) => handleRowChange(index, "profesor", value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione un profesor" />
                              </SelectTrigger>
                              <SelectContent>
                                {professors.map((professor) => (
                                  <SelectItem key={professor.ci_profesor} value={professor.ci_profesor.toString()}>
                                    {`${professor.nom_profesor_materia} ${professor.ape_profesor_materia}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Button type="button" onClick={handleAddRow} className="mt-4">
                    Añadir Fila
                  </Button>

                  <div className="flex justify-center mt-6">
                    <Button type="submit" className="bg-[#004976] text-white hover:bg-[#003357]">
                      Guardar Planificación
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

