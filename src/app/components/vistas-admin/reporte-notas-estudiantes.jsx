'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { urls } from '../urls';

export default function ReporteNotas() {
  const router = useRouter();
  const [notas, setNotas] = useState([]);
  const [cohortes, setCohortes] = useState([]);
  const [codigosMaterias, setCodigosMaterias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCohorte, setFiltroCohorte] = useState('');
  const [filtroCodigoMateria, setFiltroCodigoMateria] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const notasPorPagina = 10;

  const resetSearch = () => {
    setNotas([]);
    fetchNotas();
  };

  const fetchNotas = async () => {
    setIsLoading(true);
    try {
      // Construcción de los parámetros de consulta
      const queryParams = new URLSearchParams({
        q_code: filtroCohorte === 'all' ? '' : filtroCohorte,
        m_code: filtroCodigoMateria === 'all' ? '' : filtroCodigoMateria,
      }).toString();

      // Solicitud para obtener las notas filtradas
      const response = await fetch(`${urls.listado_estudiantes}?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Header con el token
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar las notas');
      }

      // Solicitud para obtener datos para los selects
      const dataFiltersSelectsResponse = await fetch(urls.listado_estudiantes, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Header con el token
        },
      });

      if (!dataFiltersSelectsResponse.ok) {
        throw new Error('Error al cargar los datos para filtros');
      }

      const dataFiltersSelects = await dataFiltersSelectsResponse.json();

      const cohortes = [...new Set(dataFiltersSelects.map((nota) => nota.codigo_cohorte))];
      const codigosMaterias = [...new Set(dataFiltersSelects.map((nota) => nota.cod_materia))];
      setCohortes(cohortes);
      setCodigosMaterias(codigosMaterias);

      const data = await response.json();
      setNotas(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, [filtroCohorte, filtroCodigoMateria]);

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" }, 
    {title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ];

  const notasFiltradas = notas.filter((nota) =>
    (!filtroCohorte || nota.codigo_cohorte === filtroCohorte) &&
    (!filtroCodigoMateria || nota.cod_materia === filtroCodigoMateria)
  );

  const totalPaginas = Math.ceil(notasFiltradas.length / notasPorPagina);
  const indiceInicial = (paginaActual - 1) * notasPorPagina;
  const indiceFinal = indiceInicial + notasPorPagina;
  const notasPaginadas = notasFiltradas.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };


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
                localStorage.removeItem("token");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                router.push("/home-all");
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
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="flex items-center px-6 py-2 text-[#004976] gap-3"
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Card className="mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Reporte de Notas</h2>
              <div className="flex justify-between mb-4">
                <Select onValueChange={(v) => setFiltroCohorte(v == 'all' ? '' : v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por Cohorte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Cohortes</SelectItem>
                    {cohortes.map(cohorte => (
                      <SelectItem key={cohorte} value={cohorte}>{cohorte}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={resetSearch}
                  className="md:col-span-3 mt-2 bg-gray-500 text-white hover:bg-gray-600"
                >
                  Resetear Búsqueda
                </Button>
                <Select onValueChange={(v) => setFiltroCodigoMateria(v == 'all' ? '' : v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por Código de Materia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Materias</SelectItem>
                    {codigosMaterias.map(codigo => (
                      <SelectItem key={codigo} value={codigo}>{codigo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isLoading ? (
                <p className="text-center">Cargando notas...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cohorte</TableHead>
                        <TableHead>Cédula</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Código Materia</TableHead>
                        <TableHead>Materia</TableHead>
                        <TableHead>Profesor</TableHead>
                        <TableHead className="text-right">Nota</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notasPaginadas.map((nota) => (
                        <TableRow key={`${nota.cedula_estudiante}-${nota.cod_materia}`}>
                          <TableCell>{nota.codigo_cohorte}</TableCell>
                          <TableCell>{nota.cedula_estudiante}</TableCell>
                          <TableCell>{nota.nombre}</TableCell>
                          <TableCell>{nota.apellido}</TableCell>
                          <TableCell>{nota.cod_materia}</TableCell>
                          <TableCell>{nota.nombre_materia}</TableCell>
                          <TableCell>{`${nota.nom_profesor_materia} ${nota.ape_profesor_materia}`}</TableCell>
                          <TableCell className="text-right">{nota.nota}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                </Button>
                <span>Página {paginaActual} de {totalPaginas}</span>
                <Button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="flex items-center"
                >
                  Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

