"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FileText, ClipboardList, BookOpen, User, Home } from "lucide-react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { urls } from "../urls";

export default function CrearPlanificacion() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cohorte, setCohorte] = useState("");
  const [materia, setMateria] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([
    { numero: 1, tipo: "", porcentaje: 0, otroTipo: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [percentageAlert, setPercentageAlert] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/p-login-profe");
      return;
    }

    const fetchData = async () => {
      try {
        await fetchUserData(token);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          router.push("/p-login-profe");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (userData) {
      fetchAssignedCourses(localStorage.getItem("token"), userData.cedula);
    }
  }, [userData]);

  // Removed useEffect hook
  // useEffect(() => {
  //   calcularTotalPorcentaje()
  // }, [evaluaciones])

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user-info/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.tipo_usuario == 1 || response.data.tipo_usuario == 2) {
        router.push("/home-all");
        localStorage.removeItem("token");
        return;
      }

      setUserData(response.data);
      console.log("Cédula del usuario:", response.data.cedula);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      throw error;
    }
  };

  const fetchAssignedCourses = async (token, cedula) => {
    try {
      const response = await axios.get(
        urls.asignar_profesor_materia,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Filtrar los cursos asignados por la cédula del profesor
        const filteredCourses = response.data.filter(
          (course) => course.cedula_profesor === cedula
        );
        setAssignedCourses(filteredCourses);
        console.log("Cursos asignados obtenidos:", filteredCourses);
      } else {
        throw new Error("Failed to fetch assigned courses");
      }
    } catch (error) {
      console.error("Error al obtener los cursos asignados:", error);
      throw error;
    }
  };

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/p-home-profe" },
    {
      title: "Crear Planificación",
      icon: FileText,
      href: "/p-crear-planificacion",
    },
    { title: "Cargar Notas", icon: ClipboardList, href: "/p-cargar-notas" },
    {
      title: "Listar Materias Asignadas",
      icon: BookOpen,
      href: "/p-listar-materias",
    },
    { title: "Mis Datos", icon: User, href: "/p-datos-profe" },
  ];

  const tiposEvaluacion = ["Exposición", "Trabajo", "Examen", "Taller", "Otro"];

  const handleAddEvaluacion = () => {
    setEvaluaciones([
      ...evaluaciones,
      {
        numero: evaluaciones.length + 1,
        tipo: "",
        porcentaje: 0,
        otroTipo: "",
      },
    ]);
  };

  const handleEvaluacionChange = (index, field, value) => {
    const newEvaluaciones = [...evaluaciones];
    newEvaluaciones[index][field] = value;
    setEvaluaciones(newEvaluaciones);
    const total = calcularTotalPorcentaje();
    updatePercentageAlert(total);
  };

  const calcularTotalPorcentaje = () => {
    const total = evaluaciones.reduce(
      (total, evaluacion) => total + Number(evaluacion.porcentaje),
      0
    );
    return total;
  };

  const updatePercentageAlert = (total) => {
    if (total < 100) {
      setPercentageAlert(`Falta ${100 - total}% para completar el 100%`);
    } else if (total > 100) {
      setPercentageAlert(
        `Se ha excedido en ${total - 100}% del 100% permitido`
      );
    } else {
      setPercentageAlert("");
    }
  };

  const handleGuardar = async () => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token de autenticación");
      return;
    }

    // Find the selected course to get its name
    const selectedCourse = assignedCourses.find(
      (course) => course.cod_materia === materia
    );
    if (!selectedCourse) {
      setError("No se encontró la información de la materia seleccionada");
      return;
    }

    const actividades_planificacion = evaluaciones
      .map((e) => (e.tipo === "Otro" ? e.otroTipo : e.tipo))
      .filter((tipo) => tipo !== "")
      .join("-");

    const actividades_porcentaje = evaluaciones
      .map((e) => e.porcentaje)
      .filter((porcentaje) => porcentaje > 0)
      .join("-");

    const planificacion = {
      codplanificacion: `${cohorte}-${materia}`,
      actividades_planificacion,
      actividades_porcentaje,
      cod_materia: materia,
      codigo_cohorte: cohorte,
      cedula_profesor: userData.cedula,
      nombre_materia: selectedCourse.nom_materia,
    };

    console.log("Datos de planificación a enviar:", planificacion);

    try {
      const response = await axios.post(urls.code_planing, planificacion, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        console.log("Planificación guardada exitosamente:", response.data);
        setSuccess("Planificación creada exitosamente");
        setTimeout(() => {
          router.push("/p-home-profe");
        }, 2000);
      } else {
        console.error("Error al guardar la planificación:", response.data);
        setError("Error al guardar la planificación");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error al enviar la planificación:",
          error.response?.data
        );
        if (
          error.response?.status === 400 &&
          error.response?.data?.detail?.includes("already exists")
        ) {
          setError("Ya existe una planificación con este código");
        } else {
          setError(
            `Error al guardar la planificación: ${
              error.response?.data?.detail || error.message
            }`
          );
        }
      } else {
        console.error("Error desconocido:", error);
        setError("Ocurrió un error desconocido al guardar la planificación");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    );
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
                Bienvenido, PROFESOR: {userData.nombre} {userData.apellido}
              </span>
            )}
            <Button
              variant="secondary"
              className="bg-[#FFD580] text-black hover:bg-[#FFD580] hover:text-black"
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/home-all");
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
            <CardTitle className="text-2xl font-bold text-center text-[#004976]">
              Crear Planificación
            </CardTitle>
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
            {percentageAlert && (
              <Alert variant="warning" className="mb-4">
                <AlertTitle>Advertencia</AlertTitle>
                <AlertDescription>{percentageAlert}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cohorte
                </label>
                <Select onValueChange={setCohorte}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione cohorte" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      ...new Set(
                        assignedCourses.map((course) => course.codigo_cohorte)
                      ),
                    ].map((cohort) => (
                      <SelectItem key={`cohorte-${cohort}`} value={cohort}>
                        {cohort}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Materia
                </label>
                <Select onValueChange={setMateria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedCourses
                      .filter((course) => course.codigo_cohorte === cohorte)
                      .map((course) => (
                        <SelectItem
                          key={`materia-${course.cod_materia}`}
                          value={course.cod_materia}
                        >
                          {course.nom_materia}
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
                            onValueChange={(value) =>
                              handleEvaluacionChange(index, "tipo", value)
                            }
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
                              onChange={(e) =>
                                handleEvaluacionChange(
                                  index,
                                  "otroTipo",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={evaluacion.porcentaje}
                            onChange={(e) =>
                              handleEvaluacionChange(
                                index,
                                "porcentaje",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between items-center">
                  <Button onClick={handleAddEvaluacion}>
                    Agregar Evaluación
                  </Button>
                  <p className="text-lg font-semibold">
                    Total: {calcularTotalPorcentaje()}%
                  </p>
                </div>
                <div className="mt-6 text-center">
                  <Button
                    onClick={handleGuardar}
                    disabled={calcularTotalPorcentaje() !== 100}
                  >
                    Guardar Planificación
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
