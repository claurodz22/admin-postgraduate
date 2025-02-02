"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { FileText, ClipboardList, BookOpen, User, Home } from "lucide-react"
import axios from "axios"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CrearPlanificacion() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [materias, setMaterias] = useState([])
  const [cohortes, setCohortes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cohorte, setCohorte] = useState("")
  const [materia, setMateria] = useState("")
  const [evaluaciones, setEvaluaciones] = useState([{ numero: 1, tipo: "", porcentaje: 0, otroTipo: "" }])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/p-login-profe")
      return
    }

    const fetchData = async () => {
      try {
        await fetchUserData(token)
        await fetchMaterias(token)
        await fetchCohortes(token)
      } catch (error) {
        console.error("Error fetching data:", error)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token")
          router.push("/p-login-profe")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user-info/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserData(response.data)
      console.log("Cédula del usuario:", response.data.cedula)
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error)
      throw error
    }
  }

  const fetchMaterias = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/profe-materias/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200) {
        setMaterias(response.data)
        console.log("Materias obtenidas:", response.data)
      } else {
        throw new Error("Failed to fetch materias")
      }
    } catch (error) {
      console.error("Error al obtener las materias:", error)
      throw error
    }
  }

  const fetchCohortes = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cohortes/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200) {
        setCohortes(response.data)
        console.log("Cohortes obtenidos:", response.data)
      } else {
        throw new Error("Failed to fetch cohortes")
      }
    } catch (error) {
      console.error("Error al obtener los cohortes:", error)
      throw error
    }
  }

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/p-home-profe" },
    { title: "Crear Planificación", icon: FileText, href: "/p-crear-planificacion" },
    { title: "Cargar Notas", icon: ClipboardList, href: "/p-cargar-notas" },
    { title: "Listar Materias Asignadas", icon: BookOpen, href: "/p-listar-materias" },
    { title: "Mis Datos", icon: User, href: "/p-datos-profe" },
  ]

  const tiposEvaluacion = ["Exposición", "Trabajo", "Examen", "Taller", "Otro"]

  const handleAddEvaluacion = () => {
    setEvaluaciones([...evaluaciones, { numero: evaluaciones.length + 1, tipo: "", porcentaje: 0, otroTipo: "" }])
  }

  const handleEvaluacionChange = (index, field, value) => {
    const newEvaluaciones = [...evaluaciones]
    newEvaluaciones[index][field] = value
    setEvaluaciones(newEvaluaciones)
  }

  const calcularTotalPorcentaje = () => {
    return evaluaciones.reduce((total, evaluacion) => total + Number(evaluacion.porcentaje), 0)
  }

  const handleGuardar = async () => {
    setError("")
    setSuccess("")
    const token = localStorage.getItem("token")
    if (!token) {
      setError("No se encontró el token de autenticación")
      return
    }

    const actividades_planificacion = evaluaciones
      .map((e) => (e.tipo === "Otro" ? e.otroTipo : e.tipo))
      .filter((tipo) => tipo !== "")
      .join("-")

    const actividades_porcentaje = evaluaciones
      .map((e) => e.porcentaje)
      .filter((porcentaje) => porcentaje > 0)
      .join("-")

    const planificacion = {
      codplanificacion: `${cohorte}-${materia}`,
      actividades_planificacion,
      actividades_porcentaje,
      cod_materia: materia,
      codigo_cohorte: cohorte,
      cedula_profesor: userData.cedula, // Add this line
    }

    console.log("Datos de planificación a enviar:", planificacion)

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/profe-plan/", planificacion, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 201) {
        console.log("Planificación guardada exitosamente:", response.data)
        setSuccess("Planificación creada exitosamente")
        setTimeout(() => {
          router.push("/p-home-profe")
        }, 2000)
      } else {
        console.error("Error al guardar la planificación:", response.data)
        setError("Error al guardar la planificación")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al enviar la planificación:", error.response?.data)
        if (error.response?.status === 400 && error.response?.data?.detail?.includes("already exists")) {
          setError("Ya existe una planificación con este código")
        } else {
          setError(`Error al guardar la planificación: ${error.response?.data?.detail || error.message}`)
        }
      } else {
        console.error("Error desconocido:", error)
        setError("Ocurrió un error desconocido al guardar la planificación")
      }
    }
  }

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
              <span className="text-lg">
                Bienvenido, {userData.nombre} {userData.apellido}
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
            <li key={`${item.title}-${index}`}>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#004976]">Crear Planificación</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="mb-4">
                <AlertTitle>Éxito</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cohorte</label>
                <Select onValueChange={setCohorte}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione cohorte" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohortes.map((c) => (
                      <SelectItem key={`cohorte-${c.codigo_cohorte}`} value={c.codigo_cohorte}>
                        {c.codigo_cohorte}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                <Select onValueChange={setMateria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {materias.map((m) => (
                      <SelectItem key={`materia-${m.id}`} value={m.cod_materia}>
                        {m.nombre_materia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {cohorte && materia && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° de Evaluación</TableHead>
                      <TableHead>Tipo de Evaluación</TableHead>
                      <TableHead>Porcentaje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluaciones.map((evaluacion, index) => (
                      <TableRow key={`evaluacion-${index}`}>
                        <TableCell>{evaluacion.numero}</TableCell>
                        <TableCell>
                          <Select
                            value={evaluacion.tipo}
                            onValueChange={(value) => handleEvaluacionChange(index, "tipo", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {tiposEvaluacion.map((tipo) => (
                                <SelectItem key={`tipo-${tipo}`} value={tipo}>
                                  {tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {evaluacion.tipo === "Otro" && (
                            <Input
                              className="mt-2"
                              placeholder="Especifique otro tipo"
                              value={evaluacion.otroTipo}
                              onChange={(e) => handleEvaluacionChange(index, "otroTipo", e.target.value)}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={evaluacion.porcentaje}
                            onChange={(e) => handleEvaluacionChange(index, "porcentaje", e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between items-center">
                  <Button onClick={handleAddEvaluacion}>Agregar Evaluación</Button>
                  <p className="text-lg font-semibold">Total: {calcularTotalPorcentaje()}%</p>
                </div>
                <div className="mt-6 text-center">
                  <Button onClick={handleGuardar} disabled={calcularTotalPorcentaje() !== 100}>
                    Guardar Planificación
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

