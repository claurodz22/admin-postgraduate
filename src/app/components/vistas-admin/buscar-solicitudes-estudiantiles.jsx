'use client'

import { useState, useEffect} from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, Search } from 'lucide-react';

/*datos para practicar tienes que añadir la bdd*/
const allStudentRequests = [
  { id: 1, code: "SOL-001", date: "2023-06-15", cedula: "V-12345678", name: "luis", type: "Constancia de Estudios", status: "Resuelta", attachment: "constancia_juan.pdf" },
  { id: 2, code: "SOL-002", date: "2023-06-14", cedula: "V-23456789", name: "cheito", type: "Cambio de Carrera", status: "En trámite", attachment: "solicitud_maria.pdf" },
  { id: 3, code: "SOL-003", date: "2023-06-13", cedula: "E-34567890", name: "claudiz", type: "Reincorporación", status: "No resuelta", attachment: "reincorporacion_carlos.pdf" },
  { id: 4, code: "SOL-004", date: "2023-06-12", cedula: "V-45678901", name: "auidla", type: "Constancia de Notas", status: "Resuelta", attachment: "notas_ana.pdf" },
  { id: 5, code: "SOL-005", date: "2023-06-11", cedula: "E-56789012", name: "rosaz", type: "Retiro de Materia", status: "En trámite", attachment: "retiro_luis.pdf" },
];

export default function BuscarSolicitudes() {
  /*
    Variables de state que se usan en 
    para filtrar los datos y gestión de los datos
  */
  const router = useRouter()
  const [cedulaTipo, setCedulaTipo] = useState('V')
  const [cedulaNumero, setCedulaNumero] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [searchResults, setSearchResults] = useState([])

  /*menu del lado izquierdo con sus enlaces */
  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro de Usuarios Nuevos", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro de Estudiantes", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" },
  ];

  /* si el usuario intenta acceder sin tener el token
  que inicia como admi entonces lo redirige para que inicie sesion*/

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])

  const handleSearch = (e) => {
    e.preventDefault()
    const cedula = `${cedulaTipo}-${cedulaNumero}`
    // Simulated search logic
    const results = allStudentRequests.filter(request => {
      const cedulaMatch = cedulaNumero ? request.cedula.includes(cedula) : true
      const dateMatch = (fechaInicio && fechaFin) ? 
        (request.date >= fechaInicio && request.date <= fechaFin) : true
      return cedulaMatch && dateMatch
    })
    setSearchResults(results)
  }

  return (
    <div className="min-h-screen flex flex-col"> 
      {/* encabezado, el mismo de los otros jsx */}
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
        {/* menu izquierdo, el mismo de los otrs jsx */}
        <aside className="w-64 bg-[#e6f3ff]">
          <nav className="py-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className="flex items-center px-6 py-2 text-[#004976] gap-3"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* contenido principal de la pag 
        buscar solicitudes estudiantiles */}
        <main className="flex-1 p-6">
          <Card className="mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Búsqueda de Solicitudes Estudiantiles</h2>
              
              {/* formulario para filtrar los datos */}
              <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cedula">Cédula</Label>
                  <div className="flex">
                    <Select 
                      value={cedulaTipo} 
                      onValueChange={setCedulaTipo}
                    >
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
                      placeholder="Ej: 12345678"
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
                <Button type="submit" className="md:col-span-3 bg-[#004976] text-white hover:bg-[#003357]">
                  <Search className="mr-2 h-4 w-4" /> Buscar Solicitudes
                </Button>
              </form>

              {/* resultados de la busqueda */}
              {searchResults.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {/*columnas de la tabla*/}
                        <TableHead>Código Solicitud</TableHead>
                        <TableHead>Fecha de Solicitud</TableHead>
                        <TableHead>Cédula del Estudiante</TableHead>
                        <TableHead>Nombre del Estudiante</TableHead>
                        <TableHead>Tipo de Solicitud</TableHead>
                        <TableHead>Status de la Solicitud</TableHead>
                        <TableHead>Attachment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.code}</TableCell>
                          <TableCell>{new Date(request.date).toLocaleDateString('es-VE')}</TableCell>
                          <TableCell>{request.cedula}</TableCell>
                          <TableCell>{request.name}</TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.status}</TableCell>
                          <TableCell>
                            <a href={`/attachments/${request.attachment}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {request.attachment}
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {searchResults.length === 0 && (
                /* en caso de no conseguir datos dice que no se encontro nada xd*/
                <p className="text-center text-gray-500 mt-4">No se encontraron resultados.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

