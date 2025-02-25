"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, ClipboardList, BookOpen, User, Upload, Send } from "lucide-react"
import axios from "axios"

// Estados de pago con sus colores correspondientes
const PAYMENT_STATUS = {
  APPROVED: { label: "Aprobado", color: "text-green-500" },
  PENDING: { label: "En espera", color: "text-yellow-500" },
  REJECTED: { label: "Rechazado", color: "text-red-500" },
  UNPAID: { label: "Sin pagar", color: "text-gray-400" },
}

export default function ControlPagos() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMaterias, setSelectedMaterias] = useState({})
  const [paymentFile, setPaymentFile] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)

  // Datos de ejemplo - Reemplazar con datos reales de la API
  const materiasPorCiclo = {
    cicloJ: [
      { id: "J1", nombre: "Materia 1", status: "UNPAID", precio: 100 },
      { id: "J2", nombre: "Materia 2", status: "UNPAID", precio: 100 },
      { id: "J3", nombre: "Materia 3", status: "UNPAID", precio: 80 },
    ],
    cicloGeneral: [
      { id: "G1", nombre: "Materia 4", status: "UNPAID", precio: 90 },
      { id: "G2", nombre: "Materia 5", status: "UNPAID", precio: 120 },
      { id: "G3", nombre: "Materia 6", status: "UNPAID", precio: 150 },
    ],
    cicloProfesional: [
      { id: "P1", nombre: "Materia 7", status: "UNPAID", precio: 120 },
      { id: "P2", nombre: "Materia 8", status: "UNPAID", precio: 120 },
      { id: "P3", nombre: "Materia 9", status: "UNPAID", precio: 160 },
    ],
  }

  // TODO: Implementar panel de administrador para:
  // 1. Modificar precios en dólares de cada materia
  // 2. Establecer tasa de cambio Bolívares/Dólar
  // 3. Actualizar precios en tiempo real

  const isCycleAvailable = (cycle) => {
    if (cycle === "cicloJ") return true
    if (cycle === "cicloGeneral") {
      return materiasPorCiclo.cicloJ.every((materia) => ["APPROVED", "PENDING"].includes(materia.status))
    }
    if (cycle === "cicloProfesional") {
      return (
        materiasPorCiclo.cicloGeneral.every((materia) => ["APPROVED", "PENDING"].includes(materia.status)) &&
        materiasPorCiclo.cicloJ.every((materia) => ["APPROVED", "PENDING"].includes(materia.status))
      )
    }
    return false
  }

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/e-login-estudiante")
      return
    }

    try {
      const response = await axios.get("http://localhost:8000/api/user-info/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserData(response.data)
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        router.push("/e-login-estudiante")
      }
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const handleMateriaSelection = (materiaId) => {
    setSelectedMaterias((prev) => {
      const newSelection = {
        ...prev,
        [materiaId]: !prev[materiaId],
      }
      return newSelection
    })
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    setPaymentFile(file)
    setSelectedFileName(file ? file.name : "")
  }

  const handleSubmitPayment = async (event) => {
    event.preventDefault()
    // Actualizar estado de materias seleccionadas a "PENDING"
    const updatedMaterias = { ...materiasPorCiclo }
    Object.keys(selectedMaterias).forEach((materiaId) => {
      if (selectedMaterias[materiaId]) {
        Object.keys(updatedMaterias).forEach((ciclo) => {
          const materiaIndex = updatedMaterias[ciclo].findIndex((m) => m.id === materiaId)
          if (materiaIndex !== -1) {
            updatedMaterias[ciclo][materiaIndex].status = "PENDING"
          }
        })
      }
    })
    // TODO: Enviar a la API
    console.log("Enviando pago...", {
      materias: selectedMaterias,
      monto: totalAmount,
      comprobante: paymentFile,
    })
  }

  const calculateTotal = useCallback(() => {
    let total = 0
    Object.values(materiasPorCiclo).forEach((ciclo) => {
      ciclo.forEach((materia) => {
        if (selectedMaterias[materia.id]) {
          total += materia.precio
        }
      })
    })
    setTotalAmount(total)
  }, [materiasPorCiclo, selectedMaterias])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  const menuItems = [
    { title: "Inicio", icon: FileText, href: "/estudiantes/e-home-estudiante" },
    { title: "Ver Pesum", icon: FileText, href: "/estudiantes/e-ver-pensum" },
    { title: "Cargar Notas", icon: ClipboardList, href: "/estudiantes/e-ver-notas" },
    { title: "Control Pago", icon: BookOpen, href: "/estudiantes/e-control-pagos" },
    { title: "Mis Datos", icon: User, href: "/estudiantes/e-datos-estudiante" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Cargando...</p>
      </div>
    )
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
                Bienvenido, Estudiante: {userData.nombre} {userData.apellido}
              </span>
            )}
            <Button
              variant="secondary"
              className="bg-[#FFD580] text-black hover:bg-[#FFD580] hover:text-black"
              onClick={() => {
                localStorage.removeItem("token")
                router.push("/home-all")
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel de Materias */}
          <div className="md:col-span-2">
            <Card className="h-full shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-[#004976]">Pensum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(materiasPorCiclo).map(([cycleKey, materias]) => (
                  <div key={cycleKey}>
                    <h3 className="text-lg font-semibold mb-2">
                      {cycleKey === "cicloJ"
                        ? "Ciclo J"
                        : cycleKey === "cicloGeneral"
                          ? "Ciclo General"
                          : "Ciclo Profesional"}
                    </h3>
                    <div className="space-y-2">
                      {materias.map((materia) => (
                        <div
                          key={materia.id}
                          className="flex items-center justify-between p-2 bg-white rounded-lg shadow-md"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedMaterias[materia.id]}
                              onCheckedChange={() => handleMateriaSelection(materia.id)}
                              disabled={!isCycleAvailable(cycleKey)}
                            />
                            <span className={!isCycleAvailable(cycleKey) ? "text-gray-400" : ""}>{materia.nombre}</span>
                            <span className="text-sm text-gray-500">
                              (${materia.precio})
                            </span>
                          </div>
                          <span className={PAYMENT_STATUS[materia.status].color}>
                            {PAYMENT_STATUS[materia.status].label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Permanencia */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Permanencia</h3>
                  <div className="flex gap-4">
                    {["I", "II", "III", "IV", "V"].map((nivel) => (
                      <div key={nivel} className="px-4 py-2 bg-white rounded-lg shadow-sm">
                        {nivel}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Pago */}
          <div>
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#004976]">Información de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monto">Monto (USD)</Label>
                    <Input id="monto" type="number" value={totalAmount} readOnly className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comprobante">Número de Comprobante</Label>
                    <Input id="comprobante" type="text" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input id="fecha" type="date" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banco">Banco Emisor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un banco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banesco">Banesco</SelectItem>
                        <SelectItem value="provincial">Provincial</SelectItem>
                        <SelectItem value="mercantil">Mercantil</SelectItem>
                        <SelectItem value="venezuela">Venezuela</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comprobante-file">Comprobante de Pago</Label>
                    <div className="space-y-2">
                      <input
                        id="comprobante-file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        required
                      />
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => document.getElementById("comprobante-file").click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Cargar
                        </Button>
                        {selectedFileName && (
                          <p className="text-sm text-gray-600 truncate">Archivo seleccionado: {selectedFileName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <Button type="submit" className="w-2/3 bg-[#004976]">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}