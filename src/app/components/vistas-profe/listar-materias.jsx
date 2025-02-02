"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, ClipboardList, BookOpen, User, Home } from "lucide-react";
import axios from "axios";

export default function ListarMaterias() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch User Data
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user-info/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // funciona pero no es la solucion adecuada segun cristian
      if (response.data.tipo_usuario == 1 || response.data.tipo_usuario == 2){
        router.push("/home-all");
        localStorage.removeItem("token")
      return;
      }
      
      setUserData(response.data); // Actualiza los datos del usuario
      console.log("Cédula del usuario:", response.data.cedula_usuario);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        router.push("/p-login-profe");
      }
    }
  };

  // Fetch Materias
  const fetchMaterias = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/profe-materias/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMaterias(response.data);
        console.log("Materias obtenidas:", response.data);
      } else {
        throw new Error("Failed to fetch materias");
      }
    } catch (error) {
      console.error("Error al obtener las materias:", error);
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
      fetchMaterias(token);
    }
  }, [router]);

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/p-home-profe" },
    { title: "Crear Planificación", icon: FileText, href: "/p-crear-planificacion" },
    { title: "Cargar Notas", icon: ClipboardList, href: "/p-cargar-notas" },
    { title: "Listar Materias Asignadas", icon: BookOpen, href: "/p-listar-materias" },
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
              <span className="text-lg">
                Bienvenido, {userData.nombre} {userData.apellido}
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
                  <TableHead>Código Maestría</TableHead>
                  <TableHead>Nombre de la Materia</TableHead>
                  <TableHead>Código de la Materia</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materias.map((materia, index) => (
                  <TableRow key={index}>
                    <TableCell>{materia.cod_maestria}</TableCell>
                    <TableCell>{materia.nombre_materia}</TableCell>
                    <TableCell>{materia.cod_materia}</TableCell>
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
