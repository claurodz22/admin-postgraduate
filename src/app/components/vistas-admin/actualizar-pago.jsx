"use client"

import { useState, useEffect, useCallback } from "react"
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

export default function ActualizarEstadoPagos() {
  const router = useRouter()
  const [allPayments, setAllPayments] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [selectedPayments, setSelectedPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const paymentsPerPage = 5

  // Search state
  const [cedulaTipo, setCedulaTipo] = useState("V")
  const [cedulaNumero, setCedulaNumero] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [estadoPago, setEstadoPago] = useState("todos")

  // Memorizar la función fetchPayments con useCallback
  const fetchPayments = useCallback(async () => {
    try {
      const response = await fetch(urls.pagos, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      setError(`Error al cargar los pagos: ${err.message}`)
      console.error("Error fetching payments:", err)
    } finally {
      setIsLoading(false)
    }
  }, []) // Sin dependencias, la función se crea una sola vez

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/administrador/a-login-admin")
    } else {
      fetchPayments().then((data) => {
        if (data) {
          setAllPayments(data)
          setFilteredPayments(data)
        }
      })
    }
  }, [router, fetchPayments]) // Ahora es seguro incluir fetchPayments como dependencia

  const handlePaymentSelect = (payment) => {
    setSelectedPayments((prev) => {
      const isAlreadySelected = prev.some((p) => p.numero_referencia === payment.numero_referencia)
      if (isAlreadySelected) {
        return prev.filter((p) => p.numero_referencia !== payment.numero_referencia)
      } else {
        return [...prev, { ...payment, newStatus: payment.estado_pago }]
      }
    })
  }

  const handleUpdateStatus = async () => {
    if (selectedPayments.length === 0) {
      setError("Por favor, seleccione al menos un pago para actualizar.")
      return
    }

    try {
      const response = await fetch(urls.actualizar_pagos, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          pagos: selectedPayments.map((p) => ({
            numero_referencia: p.numero_referencia,
            nuevoEstado: p.newStatus,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)
      // Refresh payments after update
      const updatedPayments = await fetchPayments()
      if (updatedPayments) {
        setAllPayments(updatedPayments)
        setFilteredPayments(updatedPayments)
        setSelectedPayments([])
        setError(null)
      }
    } catch (err) {
      setError(`Error al actualizar los pagos: ${err.message}`)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    const cedula = cedulaNumero ? `${cedulaTipo}-${cedulaNumero}` : ""
    const results = allPayments.filter((payment) => {
      const cedulaMatch = cedula === "" || payment.cedula_responsable?.includes(cedula)

      let dateMatch = true
      if (fechaInicio && fechaFin) {
        const fechaPago = new Date(payment.fecha_pago)
        dateMatch = fechaPago >= new Date(fechaInicio) && fechaPago <= new Date(fechaFin)
      }

      // Mejorado el filtro de estado
      const statusMatch =
        estadoPago === "todos" ||
        (payment.estado_pago && payment.estado_pago.trim().toLowerCase() === estadoPago.trim().toLowerCase())

      return cedulaMatch && dateMatch && statusMatch
    })

    setFilteredPayments(results)
    setCurrentPage(1)
  }

  const resetSearch = () => {
    setFilteredPayments(allPayments)
    setCedulaTipo("V")
    setCedulaNumero("")
    setFechaInicio("")
    setFechaFin("")
    setEstadoPago("todos")
    setCurrentPage(1)
  }

  const handleStatusChange = (numeroReferencia, newStatus) => {
    setSelectedPayments((prev) => prev.map((p) => (p.numero_referencia === numeroReferencia ? { ...p, newStatus } : p)))
  }

  const removeSelectedPayment = (numeroReferencia) => {
    setSelectedPayments((prev) => prev.filter((p) => p.numero_referencia !== numeroReferencia))
  }

  // Pagination
  const indexOfLastPayment = currentPage * paymentsPerPage
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment)
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
        {/* Sidebar */}
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

        {/* Main content */}
        <main className="flex-1 p-6">
          <Card className="bg-[#FFEFD5] mb-6">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Actualizar Estado de Pagos</h2>

              <form onSubmit={handleSearch} className="mb-6 grid grid-cols-4 gap-4">
                <div className="col-span-1">
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
                  <Label htmlFor="estadoPago">Estado del Pago</Label>
                  <Select value={estadoPago} onValueChange={setEstadoPago}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="negado">Negado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4 flex justify-center gap-4 mt-4">
                  <Button type="submit" className="h-12 bg-[#004976] text-white hover:bg-[#003357] w-[600px]">
                    <Search className="mr-2 h-5 w-5" /> Buscar Pagos
                  </Button>
                  <Button
                    type="button"
                    onClick={resetSearch}
                    className="h-12 bg-gray-500 text-white hover:bg-gray-600 w-[600px]"
                  >
                    Resetear Búsqueda
                  </Button>
                </div>
              </form>

              {isLoading ? (
                <p className="text-center">Cargando pagos...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Seleccionar</TableHead>
                        <TableHead>Fecha del Pago</TableHead>
                        <TableHead>Número de Referencia</TableHead>
                        <TableHead>Nombre Bachiller</TableHead>
                        <TableHead>Estado Actual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPayments.map((payment) => (
                        <TableRow key={payment.numero_referencia}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPayments.some((p) => p.numero_referencia === payment.numero_referencia)}
                              onCheckedChange={() => handlePaymentSelect(payment)}
                            />
                          </TableCell>
                          <TableCell>
                            {payment.fecha_pago ? new Date(payment.fecha_pago).toLocaleDateString("es-VE") : "N/A"}
                          </TableCell>
                          <TableCell>{payment.numero_referencia || "N/A"}</TableCell>
                          <TableCell>{`${payment.nombre_estudiante || "N/A"} ${payment.apellido_estudiante || ""}`}</TableCell>
                          <TableCell>{payment.estado_pago || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination controls */}
              <div className="flex justify-between items-center mt-4">
                <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  Anterior
                </Button>
                <span>
                  Página {currentPage} de {totalPages || 1}
                </span>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#004976] mb-4">Actualizar Estado</h3>
              {selectedPayments.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número de Referencia</TableHead>
                        <TableHead>Nombre Bachiller</TableHead>
                        <TableHead>Estado Actual</TableHead>
                        <TableHead>Nuevo Estado</TableHead>
                        <TableHead>Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPayments.map((payment) => (
                        <TableRow key={payment.numero_referencia}>
                          <TableCell>{payment.numero_referencia}</TableCell>
                          <TableCell>{`${payment.nombre_estudiante} ${payment.apellido_estudiante}`}</TableCell>
                          <TableCell>{payment.estado_pago}</TableCell>
                          <TableCell>
                            <Select
                              value={payment.newStatus}
                              onValueChange={(value) => handleStatusChange(payment.numero_referencia, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar nuevo estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="Confirmado">Confirmado</SelectItem>
                                <SelectItem value="Negado">Negado</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSelectedPayment(payment.numero_referencia)}
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
                    Actualizar Pagos
                  </Button>
                </div>
              ) : (
                <p>No hay pagos seleccionados para actualizar.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

