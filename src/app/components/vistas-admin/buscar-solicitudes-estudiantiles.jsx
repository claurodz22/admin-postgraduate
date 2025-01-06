'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, Search } from 'lucide-react'

export default function BuscarSolicitudes() {
  const router = useRouter()
  const [cedulaTipo, setCedulaTipo] = useState('V')
  const [cedulaNumero, setCedulaNumero] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allResults, setAllResults] = useState([])

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro de Usuarios Nuevos", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro de Estudiantes", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" },
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/solicitudes/')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSearchResults(data)
        setAllResults(data)
      } catch (err) {
        setError(`Error al cargar las solicitudes: ${err.message || String(err)}`)
        console.error('Error fetching solicitudes:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSolicitudes()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    let searchCedula = cedulaNumero.trim()
    
    // If the input starts with 'V-' or 'E-', remove it
    if (searchCedula.startsWith('V-') || searchCedula.startsWith('E-')) {
      searchCedula = searchCedula.slice(2)
    }
    
    const cedula = `${cedulaTipo}-${searchCedula}`
    
    const filteredResults = allResults.filter(request => {
      const cedulaMatch = searchCedula ? 
        (request.cedula_responsable.includes(cedula) || 
         request.cedula_responsable.includes(searchCedula)) : true
      const dateMatch = (fechaInicio && fechaFin) ? 
        (new Date(request.fecha_solicitud) >= new Date(fechaInicio) && 
         new Date(request.fecha_solicitud) <= new Date(fechaFin)) : true
      return cedulaMatch && dateMatch
    })
    setSearchResults(filteredResults)
  }

  const handleResetSearch = () => {
    setSearchResults(allResults)
    setCedulaTipo('V')
    setCedulaNumero('')
    setFechaInicio('')
    setFechaFin('')
  }

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
                localStorage.removeItem("token")
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                router.push("/home-all")
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
                    <item.icon className="h-5 w-5" />
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
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Búsqueda de Solicitudes Estudiantiles</h2>
              
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
                <Button 
                  type="button" 
                  onClick={handleResetSearch}
                  className="md:col-span-3 mt-2 bg-gray-500 text-white hover:bg-gray-600"
                >
                  Resetear Búsqueda
                </Button>
              </form>

              {isLoading ? (
                <p className="text-center">Cargando solicitudes...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : searchResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código Solicitud</TableHead>
                        <TableHead>Fecha Solicitud</TableHead>
                        <TableHead>Cédula Responsable</TableHead>
                        <TableHead>Nombre Estudiante</TableHead>
                        <TableHead>Apellido Estudiante</TableHead>
                        <TableHead>Status de Solicitud</TableHead>
                        <TableHead>Tipo de Solicitud</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((request) => (
                        <TableRow key={request.cod_solicitudes}>
                          <TableCell>{request.cod_solicitudes}</TableCell>
                          <TableCell>{request.fecha_solicitud ? new Date(request.fecha_solicitud).toLocaleDateString('es-VE') : 'N/A'}</TableCell>
                          <TableCell>{request.cedula_responsable}</TableCell>
                          <TableCell>{request.nombre_estudiante}</TableCell>
                          <TableCell>{request.apellido_estudiante}</TableCell>
                          <TableCell>{request.status_solicitud}</TableCell>
                          <TableCell>{request.tipo_solicitud}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-4">No se encontraron resultados.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

