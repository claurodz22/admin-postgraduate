"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, ClipboardList, BookOpen, User, Home } from "lucide-react";
import axios from "axios";
import { urls } from "../urls";

export default function ListarMaterias() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [maestrias, setMaestrias] = useState([]);
  const [maestriasIndexedByCode, setMaestriasIndexedByCode] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMaterias, setLoadingMaterias] = useState(false);

  const fetchMaestrias = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay token");
    }

    try {
      const response = await axios.get(urls.maestrias, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("fetchMaestrias:", error);
      throw error;
    }
  };
  const getMaestriaName = (cod_materia) => {
    const maestriaCode = cod_materia.slice(0, 4); // Extraemos los primeros 4 caracteres

    // Asignamos el nombre de la maestría según el código
    switch (maestriaCode) {
      case "8207":
        return "Gerencia en RRHH";
      case "8306":
        return "Finanzas";
      case "8327":
        return "Gerencia General";
      default:
        return "Desconocida"; // Si el código no coincide con ninguno de los anteriores
    }
    // return maestriasIndexedByCode[cod_materia]?.nombre_maestria;
  };

  async function handleFetchMaestrias() {
    try {
      const data = await fetchMaestrias();
      setMaestrias(data);
      setMaestriasIndexedByCode(
        data.reduce((acc, maestria) => {
          acc[maestria.cod_maestria] = maestria;
          return acc;
        }, {})
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingMaterias(false);
    }
  }

  useEffect(() => {
    handleFetchMaestrias();
  }, [router]);

  useEffect(() => {
    if (maestrias.length) {
      console.log("[getMaestriaName]", "8207", getMaestriaName("8207"));
      console.log("[getMaestriaName]", "8327", getMaestriaName("8327"));
      console.log("[getMaestriaName]", "8306", getMaestriaName("8306"));
    }
  }, [maestrias]);
  // Fetch User Data
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
      console.log("Cédula del usuario:", response.data.cedula_usuario);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        router.push("/p-login-profe");
      }
    }
  };

  // Fetch Materias Asignadas
  const fetchfilteredCourses = async (token) => {
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
        console.log(response.data); // Verifica la respuesta de la API
        // Filtrar las materias por la cédula del profesor
        const filteredCourses = response.data.filter(
          (course) => course.cedula_profesor === userData.cedula
        );
        console.log("Materias asignadas filtradas:", filteredCourses); // Verifica las materias filtradas
        setMaterias(filteredCourses);
      } else {
        throw new Error("Failed to fetch materias asignadas");
      }
    } catch (error) {
      console.error("Error al obtener las materias asignadas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Unified useEffect to Fetch User and Materias
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/p-login-profe");
    } else {
      setIsLoading(true);
      fetchUserData(token);
    }
  }, [router]);

  useEffect(() => {
    if (userData) {
      const token = localStorage.getItem("token");
      fetchfilteredCourses(token);
    }
  }, [userData]);

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
            <CardTitle className="text-2xl font-bold text-center text-[#004976]">
              Materias Asignadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Maestría</TableHead>
                  <TableHead>Nombre de la Materia</TableHead>
                  <TableHead>Código de la Materia</TableHead>
                  <TableHead>Cohorte</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materias.map((materia, index) => (
                  <TableRow key={index}>
                    {/* Llamamos a la función para obtener el nombre de la maestría */}
                    <TableCell>
                      {getMaestriaName(materia.cod_materia)}
                    </TableCell>
                    <TableCell>{materia.nom_materia}</TableCell>
                    <TableCell>{materia.cod_materia}</TableCell>
                    <TableCell>{materia.codigo_cohorte}</TableCell>
                    <TableCell>{"N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
