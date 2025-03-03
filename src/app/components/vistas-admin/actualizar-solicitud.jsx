"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { urls } from "../urls"
import { menuItems } from "../../constants/menuItemsADM"

export default function ActualizarSolicitudesEstudiantiles() {
  const router = useRouter()
  const [nacionalidad, setNacionalidad] = useState("V")
  const [cedulaNumero, setCedulaNumero] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [statusSolicitud, setStatusSolicitud] = useState("todos") // Nuevo estado para filtrar por status
  const [buscarResul, setBuscarResul] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allResults, setAllResults] = useState([])
  const [selectedRequests, setSelectedRequests] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/a-login-admin")
    }
  }, [router])

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const info_obt_json = await fetch(urls.solicitudes, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        if (!info_obt_json.ok) {
          throw new Error(`HTTP error! status: ${info_obt_json.status}`)
        }
        const info_obt_js = await info_obt_json.json()
        setBuscarResul(info_obt_js)
        setAllResults(info_obt_js)
      } catch (err) {
        setError(`Error al cargar las solicitudes: ${err.message || String(err)}`)
        console.error("Error fetching solicitudes:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSolicitudes()
  }, [])

  const buscarSoli = (e) => {
    e.preventDefault()

    let searchCedula = cedulaNumero.trim()

    if (searchCedula.startsWith("V-") || searchCedula.startsWith("E-")) {
      searchCedula = searchCedula.slice(2)
    }

    const cedula = searchCedula ? `${nacionalidad}-${searchCedula}` : ""

    const filteredResults = allResults.filter((lista_solicitud) => {
      const cedulaMatch = cedula === "" || lista_solicitud.cedula_responsable.includes(cedula)

      let periodoCoincide = true
      if (fechaInicio && fechaFin) {
        const fechaSolicitud = new Date(lista_solicitud.fecha_solicitud)
        periodoCoincide = fechaSolicitud >= new Date(fechaInicio) && fechaSolicitud <= new Date(fechaFin)
      }

      // Filtro por estado de solicitud
      const statusMatch =
        statusSolicitud === "todos" ||
        (lista_solicitud.status_solicitud &&
          lista_solicitud.status_solicitud.trim().toLowerCase() === statusSolicitud.trim().toLowerCase())

      return cedulaMatch && periodoCoincide && statusMatch
    })

    setBuscarResul(filteredResults)
  }

  const restablecer_results = () => {
    setBuscarResul(allResults)
    setNacionalidad("V")
    setCedulaNumero("")
    setFechaInicio("")
    setFechaFin("")
    setStatusSolicitud("todos") // Resetear el filtro de estado
  }

  const handleRequestSelect = (request) => {
    setSelectedRequests((prev) => {
      const isAlreadySelected = prev.some((r) => r.cod_solicitudes === request.cod_solicitudes)
      if (isAlreadySelected) {
        return prev.filter((r) => r.cod_solicitudes !== request.cod_solicitudes)
      } else {
        return [...prev, { ...request, newStatus: request.status_solicitud }]
      }
    })
  }

  const handleStatusChange = (codSolicitud, newStatus) => {
    setSelectedRequests((prev) => prev.map((r) => (r.cod_solicitudes === codSolicitud ? { ...r, newStatus } : r)))
  }

  const removeSelectedRequest = (codSolicitud) => {
    setSelectedRequests((prev) => prev.filter((r) => r.cod_solicitudes !== codSolicitud))
  }

  const handleUpdateStatus = async () => {
    if (selectedRequests.length === 0) {
      setError("Por favor, seleccione al menos una solicitud para actualizar.")
      return
    }

    try {
      const response = await fetch(urls.actualizar_solicitudes, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          solicitudes: selectedRequests.map((r) => ({
            cod_solicitudes: r.cod_solicitudes,
            nuevoEstado: r.newStatus,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)
      // Refresh solicitudes after update
      const updatedSolicitudes = await fetch(urls.solicitudes, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((res) => res.json())
      setBuscarResul(updatedSolicitudes)
      setAllResults(updatedSolicitudes)
      setSelectedRequests([])
      setError(null)
    } catch (err) {
      setError(`Error al actualizar las solicitudes: ${err.message}`)
    }
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
                  <Link href={item.href} className="flex items-center px-6 py-2 text-[#004976] gap-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Card className="mx-auto bg-[#FFEFD5] mb-6">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">
                Actualizar Solicitudes Estudiantiles
              </h2>

              <form onSubmit={buscarSoli} className="mb-6 grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="cedula">Cédula</Label>
                  <div className="flex">
                    <Select value={nacionalidad} onValueChange={setNacionalidad}>
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
                <div className="col-span-1">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="fechaFin">Fecha de Fin</Label>
                  <Input id="fechaFin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="statusSolicitud">Estado de Solicitud</Label>
                  <Select value={statusSolicitud} onValueChange={setStatusSolicitud}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en proceso">En Proceso</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="rechazada">Rechazada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4 flex justify-center gap-4 mt-4">
                  <Button type="submit" className="h-12 bg-[#004976] text-white hover:bg-[#003357] w-[600px]">
                    <Search className="mr-2 h-5 w-5" /> Buscar Solicitudes
                  </Button>
                  <Button
                    type="button"
                    onClick={restablecer_results}
                    className="h-12 bg-gray-500 text-white hover:bg-gray-600 w-[600px]"
                  >
                    Resetear Búsqueda
                  </Button>
                </div>
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
                        <TableHead>Seleccionar</TableHead>
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
                      {buscarResul.map((lista_solicitud) => (
                        <TableRow key={lista_solicitud.cod_solicitudes}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRequests.some(
                                (r) => r.cod_solicitudes === lista_solicitud.cod_solicitudes,
                              )}
                              onCheckedChange={() => handleRequestSelect(lista_solicitud)}
                            />
                          </TableCell>
                          <TableCell>{lista_solicitud.cod_solicitudes}</TableCell>
                          <TableCell>
                            {lista_solicitud.fecha_solicitud
                              ? new Date(lista_solicitud.fecha_solicitud).toLocaleDateString("es-VE")
                              : "N/A"}
                          </TableCell>
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

          <Card className="mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#004976] mb-4">Actualizar Estado de Solicitudes</h3>
              {selectedRequests.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código Solicitud</TableHead>
                        <TableHead>Nombre Estudiante</TableHead>
                        <TableHead>Estado Actual</TableHead>
                        <TableHead>Nuevo Estado</TableHead>
                        <TableHead>Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRequests.map((request) => (
                        <TableRow key={request.cod_solicitudes}>
                          <TableCell>{request.cod_solicitudes}</TableCell>
                          <TableCell>{`${request.nombre_estudiante} ${request.apellido_estudiante}`}</TableCell>
                          <TableCell>{request.status_solicitud}</TableCell>
                          <TableCell>
                            <Select
                              value={request.newStatus}
                              onValueChange={(value) => handleStatusChange(request.cod_solicitudes, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar nuevo estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="En Proceso">En Proceso</SelectItem>
                                <SelectItem value="Completada">Completada</SelectItem>
                                <SelectItem value="Rechazada">Rechazada</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSelectedRequest(request.cod_solicitudes)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button
                    onClick={handleUpdateStatus}
                    className="w-full mt-4 bg-[#004976] text-white hover:bg-[#003357]"
                  >
                    Actualizar Solicitudes
                  </Button>
                </div>
              ) : (
                <p>No hay solicitudes seleccionadas para actualizar.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

