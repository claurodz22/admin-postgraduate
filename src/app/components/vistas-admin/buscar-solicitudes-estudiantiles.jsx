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
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen, Search } from 'lucide-react'
import { urls } from '../urls'

export default function BuscarSolicitudes() {
  const router = useRouter()
  // const = variable; valor actual [el  que esta en parentesis al
  // final]; funccion para cambiar el valor
  const [nacionalidad, setnacionalidad] = useState('V')
  const [cedulaNumero, setCedulaNumero] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [buscarResul, setbuscarResul] = useState([]) // arreglo de resultados filtrados
  
  // para menejar estados de carga y errores
  const [isLoading, setIsLoading] = useState(true)    
  const [error, setError] = useState(null)

  const [allResults, setAllResults] = useState([])   // arreglos de resultados del servidor

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" }, 
    {title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ]
  
  // verificar si el usuario tiene un token de acceso
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])
  
  // peticiones al servidor
  useEffect(() => {
    // definicion de funcion fetchSolicitudes 
    const fetchSolicitudes = async () => {
      try {
        // definicion de variable info_obt_json de la api
        const info_obt_json = await fetch(urls.solicitudes/* 'solicitudes/' */, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }       
        } )
        if (!info_obt_json.ok) {
          throw new Error(`HTTP error! status: ${info_obt_json.status}`)
        }
        const info_obt_js = await info_obt_json.json()
        setbuscarResul(info_obt_js)
        setAllResults(info_obt_js)
      } catch (err) {
        setError(`Error al cargar las solicitudes: ${err.message || String(err)}`)
        console.error('Error fetching solicitudes:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSolicitudes()
  }, [])

  
  const buscarSoli = (e) => {
    e.preventDefault()
  
    let searchCedula = cedulaNumero.trim()
    
    if (searchCedula.startsWith('V-') || searchCedula.startsWith('E-')) {
      searchCedula = searchCedula.slice(2)
    }
    
    const cedula = searchCedula ? `${nacionalidad}-${searchCedula}` : ''
    
    const filteredResults = allResults.filter(lista_solicitud => {
      // Verifica cédula
      const cedulaMatch = cedula === '' || lista_solicitud.cedula_responsable.includes(cedula)
      
      // Verifica rango de fechas
      let periodoCoincide = true
      if (fechaInicio && fechaFin) {
        const fechaSolicitud = new Date(lista_solicitud.fecha_solicitud)
        periodoCoincide = fechaSolicitud >= new Date(fechaInicio) && fechaSolicitud <= new Date(fechaFin)
      }
      
      return cedulaMatch && periodoCoincide
    })
    
    setbuscarResul(filteredResults)
  }

  // restablece filtros
  const restablecer_results = () => {
    setbuscarResul(allResults)
    setnacionalidad('V')
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
                // quitar acceso ya que se 
                // esta cerrando sesión
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
              {menuItems.map((item, index) => ( // map itera en el arreglo menuItems
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
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Búsqueda de Solicitudes Estudiantiles</h2>
              
              <form onSubmit={buscarSoli} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cedula">Cédula</Label>
                  <div className="flex">
                    <Select 
                      value={nacionalidad} 
                      onValueChange={setnacionalidad}
                    >
                      <SelectTrigger className="w-[60px]">
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
                      placeholder="Ej: 012345678"
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
                  onClick={restablecer_results}
                  className="md:col-span-3 mt-2 bg-gray-500 text-white hover:bg-gray-600"
                >
                  Resetear Búsqueda
                </Button>
              </form>

              {isLoading ? (
                <p className="text-center">Cargando solicitudes...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : buscarResul.length > 0 ? (
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
                    {/*
                      lista_solicitud es el arreglo y se hace referencia
                      a la variable de acuerdo del json para evitar
                      confusiones
                    */}
                      {buscarResul.map((lista_solicitud) => (
                        <TableRow key={lista_solicitud.cod_solicitudes}>
                          <TableCell>{lista_solicitud.cod_solicitudes}</TableCell>
                          <TableCell>{lista_solicitud.fecha_solicitud ? new Date(lista_solicitud.fecha_solicitud).toLocaleDateString('es-VE') : 'N/A'}</TableCell>
                          <TableCell>{lista_solicitud.cedula_responsable}</TableCell>
                          <TableCell>{lista_solicitud.nombre_estudiante}</TableCell>
                          <TableCell>{lista_solicitud.apellido_estudiante}</TableCell>
                          <TableCell>{lista_solicitud.status_solicitud}</TableCell>
                          <TableCell>{lista_solicitud.tipo_solicitud}</TableCell>
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

