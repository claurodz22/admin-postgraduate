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

export default function CargarNotas() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [codPlanificacion, setCodPlanificacion] = useState("")
  const [estudiantes, setEstudiantes] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [planificacion, setPlanificacion] = useState(null)
  const [codigosPlanificacion, setCodigosPlanificacion] = useState([])

  const fetchCodigosPlanificacion = async () => {
    const token = localStorage.getItem("token")
    if (token && userData) {
      console.log(userData)
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profe-plan/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Filtrar solo los planes que coincidan con la cédula del usuario logueado
        const filteredPlans = response.data.filter((plan) => plan.cedula_profesor === userData.cedula)

        setCodigosPlanificacion(filteredPlans)
        console.log(filteredPlans)
      } catch (error) {
        console.error("Error fetching codigos de planificacion:", error)
      }
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/p-login-profe")
        return
      }

      try {
        const response = await axios.get("http://localhost:8000/api/user-info/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUserData(response.data)
        const cedula = response.data.cedula_usuario
        console.log(cedula)
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error)
        if (error.response && error.response.status === 401) {
          //localStorage.removeItem("token");
          //router.push("/p-login-profe");
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  useEffect(() => {
    if (userData) {
      fetchCodigosPlanificacion()
    }
  }, [userData, fetchCodigosPlanificacion]) // Added fetchCodigosPlanificacion to dependencies

  const fetchPlanificacion = async (codPlanificacion, token) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/profe-plan/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const planData = response.data.find((plan) => plan.codplanificacion === codPlanificacion)

      if (!planData) {
        console.error("No se encontró la planificación con el código:", codPlanificacion)
        return
      }

      setPlanificacion(planData)
      console.log(planData)

      const actividades = planData.actividades_planificacion.split("-")
      const porcentajes = planData.actividades_porcentaje.split("-")

      const evaluacionesData = actividades.map((actividad, index) => ({
        id: index + 1,
        nombre: actividad,
        porcentaje: Number.parseInt(porcentajes[index]),
      }))

      setEvaluaciones(evaluacionesData)
      fetchEstudiantes()
    } catch (error) {
      console.error("Error fetching planificacion:", error)
    }
  }

  const fetchEstudiantes = async () => {
    const token = localStorage.getItem("token")
    // Simular una llamada a la API para obtener estudiantes y evaluaciones
    const estudiantesData = [
      { id: 1, cedula: "12345678", nombre: "Juan", apellido: "Pérez", notas: {} },
      { id: 2, cedula: "87654321", nombre: "María", apellido: "González", notas: {} },
      { id: 3, cedula: "23456789", nombre: "Carlos", apellido: "Rodríguez", notas: {} },
    ]
    setEstudiantes(estudiantesData)
  }

  const handleCodPlanificacionChange = (value) => {
    setCodPlanificacion(value)
    const token = localStorage.getItem("token")
    if (token) {
      fetchPlanificacion(value, token)
    }
  }

  const handleNotaChange = (estudianteId, evaluacionId, valor) => {
    setEstudiantes(
      estudiantes.map((estudiante) => {
        if (estudiante.id === estudianteId) {
          return {
            ...estudiante,
            notas: {
              ...estudiante.notas,
              [evaluacionId]: Number.parseFloat(valor),
            },
          }
        }
        return estudiante
      }),
    )
  }

  const calcularNotaPrevia = (estudiante) => {
    if (!estudiante.notas) return 0
    return evaluaciones
      .reduce((total, evaluacion) => {
        const nota = estudiante.notas[evaluacion.id] || 0
        return total + (nota * evaluacion.porcentaje) / 100
      }, 0)
      .toFixed(2)
  }

  const calcularNotaFinal = (estudiante) => {
    const notaPrevia = calcularNotaPrevia(estudiante)
    return Math.round(Number.parseFloat(notaPrevia))
  }

  const handleGuardar = () => {
    console.log("Notas guardadas:", estudiantes)
    // Aquí iría la lógica para enviar las notas al backend
  }

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/p-home-profe" },
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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#004976]">Cargar Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Código de Planificación</label>
              <Select onValueChange={handleCodPlanificacionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione código de planificación" />
                </SelectTrigger>
                <SelectContent>
                  {codigosPlanificacion.map((plan) => (
                    <SelectItem key={plan.codplanificacion} value={plan.codplanificacion}>
                      {`${plan.codplanificacion} - ${plan.cod_materia} (${plan.cedula_profesor})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {planificacion && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Detalles de la Planificación</h3>
                <p>
                  <strong>Código de Materia:</strong> {planificacion.cod_materia}
                </p>
                <p>
                  <strong>Código de Cohorte:</strong> {planificacion.codigo_cohorte}
                </p>
                <h4 className="text-md font-semibold mt-2 mb-1">Actividades y Porcentajes:</h4>
                <ul>
                  {evaluaciones.map((evaluacion) => (
                    <li key={evaluacion.id}>
                      {evaluacion.nombre}: {evaluacion.porcentaje}%
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {planificacion && estudiantes.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      {evaluaciones.map((evaluacion) => (
                        <TableHead key={evaluacion.id}>
                          {evaluacion.nombre} ({evaluacion.porcentaje}%)
                        </TableHead>
                      ))}
                      <TableHead>Nota Previa</TableHead>
                      <TableHead>Nota Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estudiantes.map((estudiante) => (
                      <TableRow key={estudiante.id}>
                        <TableCell>{`${estudiante.nombre} ${estudiante.apellido}`}</TableCell>
                        {evaluaciones.map((evaluacion) => (
                          <TableCell key={evaluacion.id}>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              value={estudiante.notas?.[evaluacion.id] || ""}
                              onChange={(e) => handleNotaChange(estudiante.id, evaluacion.id, e.target.value)}
                              className={`w-20 ${
                                estudiante.notas?.[evaluacion.id] < 0 || estudiante.notas?.[evaluacion.id] > 10
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {estudiante.notas?.[evaluacion.id] && (
                              <span className="ml-2">
                                ({((estudiante.notas[evaluacion.id] * evaluacion.porcentaje) / 100).toFixed(2)})
                              </span>
                            )}
                            {(estudiante.notas?.[evaluacion.id] < 0 || estudiante.notas?.[evaluacion.id] > 10) && (
                              <p className="text-red-500 text-xs mt-1">La nota debe estar entre 0 y 10</p>
                            )}
                          </TableCell>
                        ))}
                        <TableCell>{calcularNotaPrevia(estudiante)}</TableCell>
                        <TableCell>{calcularNotaFinal(estudiante)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 text-center">
                  <Button onClick={handleGuardar}>Guardar Notas</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

