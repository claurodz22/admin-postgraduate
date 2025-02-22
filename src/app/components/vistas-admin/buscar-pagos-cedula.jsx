"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  UserPlus,
  GraduationCap,
  ClipboardList,
  CreditCard,
  FileText,
  BookOpen,
  Search,
} from "lucide-react";
import { urls } from "../urls";
const fetchPayments = async () => {
  try {
    const response = await fetch(urls.pagos, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    setError(`Error al cargar los pagos: ${err.message}`);
    console.error("Error fetching payments:", err);
  } finally {
    setIsLoading(false);
  }
};

export default function BusquedaPagos() {
  const router = useRouter();
  const [cedulaTipo, setCedulaTipo] = useState("V");
  const [cedulaNumero, setCedulaNumero] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allPayments, setAllPayments] = useState([]);

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    {
      title: "Registro / Actualización de Usuarios ",
      icon: UserPlus,
      href: "/a-register-user",
    },
    {
      title: "Registro / Actualización de Estudiantes ",
      icon: GraduationCap,
      href: "/a-register-student",
    },
    {
      title: "Control de Notas",
      icon: ClipboardList,
      href: "/a-control-notas",
    },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    {
      title: "Solicitudes Estudiantiles",
      icon: FileText,
      href: "/a-solicitudes-estudiantiles",
    },
    { title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ];

  const handleFetchPayments = async () => {
    try {
      const data = await fetchPayments();
      setAllPayments(data);
      setSearchResults(data);
    } catch (err) {
      setError(`Error al cargar los pagos: ${err.message}`);
      console.error("Error fetching payments:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/a-login-admin");
    }
  }, [router]);

  useEffect(() => {
    handleFetchPayments();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const cedula = cedulaNumero ? `${cedulaTipo}-${cedulaNumero}` : "";
    const results = allPayments.filter((payment) => {
      const cedulaMatch =
        cedula === "" || payment.cedula_responsable?.includes(cedula);

      let dateMatch = true;
      if (fechaInicio && fechaFin) {
        const fechaPago = new Date(payment.fecha_pago);
        dateMatch =
          fechaPago >= new Date(fechaInicio) && fechaPago <= new Date(fechaFin);
      }

      return cedulaMatch && dateMatch;
    });
    setSearchResults(results);
  };

  const resetSearch = () => {
    setSearchResults(allPayments);
    setCedulaTipo("V");
    setCedulaNumero("");
    setFechaInicio("");
    setFechaFin("");
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
              {menuItems.map((item, index) => (
                <li key={index}>
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
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">
                Búsqueda de Pagos
              </h2>

              <form
                onSubmit={handleSearch}
                className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <Label htmlFor="cedula">Cédula</Label>
                  <div className="flex">
                    <Select value={cedulaTipo} onValueChange={setCedulaTipo}>
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="V">V-</SelectItem>
                        <SelectItem value="E">E-</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="cedula"
                      value={cedulaNumero}
                      onChange={(e) => setCedulaNumero(e.target.value)}
                      placeholder="Ej: 1234567890"
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fechaFin">Fecha de Fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="md:col-span-3 bg-[#004976] text-white hover:bg-[#003357]"
                >
                  <Search className="mr-2 h-4 w-4" /> Buscar Pagos
                </Button>
                <Button
                  type="button"
                  onClick={resetSearch}
                  className="md:col-span-3 mt-2 bg-gray-500 text-white hover:bg-gray-600"
                >
                  Resetear Búsqueda
                </Button>
              </form>

              {isLoading ? (
                <p className="text-center">Cargando pagos...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : searchResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha del Pago</TableHead>
                        <TableHead>Banco</TableHead>
                        <TableHead>Número de Referencia</TableHead>
                        <TableHead>Nombre Bachiller </TableHead>
                        <TableHead>Apellido Bachiller </TableHead>
                        <TableHead>Cédula del Responsable</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((payment) => (
                        <TableRow key={payment.numero_referencia}>
                          <TableCell>
                            {payment.fecha_pago
                              ? new Date(payment.fecha_pago).toLocaleDateString(
                                  "es-VE"
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell>{payment.banco_pago || "N/A"}</TableCell>
                          <TableCell>
                            {payment.numero_referencia || "N/A"}
                          </TableCell>
                          <TableCell>
                            {payment.nombre_estudiante || "N/A"}
                          </TableCell>
                          <TableCell>
                            {payment.apellido_estudiante || "N/A"}
                          </TableCell>
                          <TableCell>
                            {payment.cedula_responsable || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {payment.monto_pago !== undefined &&
                            payment.monto_pago !== null
                              ? `${Number(payment.monto_pago).toFixed(2)} Bs.`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  No se encontraron resultados.
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
