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

export default function CrearPlanificacion() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cohorte, setCohorte] = useState("")
  const [materia, setMateria] = useState("")
  const [evaluaciones, setEvaluaciones] = useState([{ numero: 1, tipo: "", porcentaje: 0, otroTipo: "" }])

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
    // Simulando la obtención de datos del usuario
    setUserData({ nombre: "Juan", apellido: "Pérez" })
  }

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/p-home-profe" },
    { title: "Crear Planificación", icon: FileText, href: "/p-crear-planificacion" },
    { title: "Cargar Notas", icon: ClipboardList, href: "/p-cargar-notas" },
    { title: "Listar Materias Asignadas", icon: BookOpen, href: "/p-listar-materias" },
    { title: "Mis Datos", icon: User, href: "/p-datos-profe" },
  ]

  const cohortesEjemplo = ["2023-1", "2023-2", "2024-1"]
  const materiasEjemplo = ["Matemáticas I", "Física I", "Programación I"]
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

  const handleGuardar = () => {
    console.log("Planificación guardada:", { cohorte, materia, evaluaciones })
    // Aquí iría la lógica para enviar los datos al backend
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
            <CardTitle className="text-2xl font-bold text-center text-[#004976]">Crear Planificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cohorte</label>
                <Select onValueChange={setCohorte}>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                <Select onValueChange={setMateria}>
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
                      <TableRow key={index}>
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
                                <SelectItem key={tipo} value={tipo}>
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

