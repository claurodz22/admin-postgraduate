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
  const [cohorte, setCohorte] = useState("")
  const [materia, setMateria] = useState("")
  const [estudiantes, setEstudiantes] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // Redirige al login si no hay token
        router.push("/p-login-profe");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/user-info/", {
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token al header4
          },
        });
        setUserData(response.data); // Actualiza el estado con los datos del usuario
        const cedula = response.data.cedula_usuario;
        console.log(cedula);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        // Redirige al login si ocurre un error no autorizado
        if (error.response && error.response.status === 401) {
          //localStorage.removeItem("token");
          //router.push("/p-login-profe");
        }
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchUserData();
  }, [router]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user_profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserData(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setIsLoading(false)
      //router.push("/p-login-profe")
    }
  }

  const fetchEstudiantes = async () => {
    // Simular una llamada a la API para obtener estudiantes y evaluaciones
    const estudiantesData = [
      { id: 1, cedula: "12345678", nombre: "Juan", apellido: "Pérez" },
      { id: 2, cedula: "87654321", nombre: "María", apellido: "González" },
      { id: 3, cedula: "23456789", nombre: "Carlos", apellido: "Rodríguez" },
    ]
    const evaluacionesData = [
      { id: 1, nombre: "Parcial 1", porcentaje: 30 },
      { id: 2, nombre: "Parcial 2", porcentaje: 30 },
      { id: 3, nombre: "Trabajo Final", porcentaje: 40 },
    ]
    setEstudiantes(estudiantesData)
    setEvaluaciones(evaluacionesData)
  }

  const handleCohorteChange = (value) => {
    setCohorte(value)
    setMateria("")
    setEstudiantes([])
    setEvaluaciones([])
  }

  const handleMateriaChange = (value) => {
    setMateria(value)
    fetchEstudiantes()
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

  const calcularNotaFinal = (estudiante) => {
    if (!estudiante.notas) return 0
    return evaluaciones
      .reduce((total, evaluacion) => {
        const nota = estudiante.notas[evaluacion.id] || 0
        return total + (nota * evaluacion.porcentaje) / 100
      }, 0)
      .toFixed(2)
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

  const cohortesEjemplo = ["2023-1", "2023-2", "2024-1"]
  const materiasEjemplo = ["MAT-101", "FIS-201", "PROG-301"]

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
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cohorte</label>
                <Select onValueChange={handleCohorteChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione cohorte" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohortesEjemplo.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código de Materia</label>
                <Select onValueChange={handleMateriaChange} disabled={!cohorte}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {materiasEjemplo.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {estudiantes.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Estudiante</TableHead>
                      <TableHead>Cédula</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Apellido</TableHead>
                      {evaluaciones.map((evaluacion) => (
                        <TableHead key={evaluacion.id}>
                          {evaluacion.nombre} ({evaluacion.porcentaje}%)
                        </TableHead>
                      ))}
                      <TableHead>Nota Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estudiantes.map((estudiante, index) => (
                      <TableRow key={estudiante.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{estudiante.cedula}</TableCell>
                        <TableCell>{estudiante.nombre}</TableCell>
                        <TableCell>{estudiante.apellido}</TableCell>
                        {evaluaciones.map((evaluacion) => (
                          <TableCell key={evaluacion.id}>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={estudiante.notas?.[evaluacion.id] || ""}
                              onChange={(e) => handleNotaChange(estudiante.id, evaluacion.id, e.target.value)}
                              className="w-16"
                            />
                          </TableCell>
                        ))}
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

