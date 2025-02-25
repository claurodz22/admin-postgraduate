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
  APPROVED: { label: "Aprobado", color: "bg-green-500" },
  PENDING: { label: "En espera", color: "bg-yellow-500" },
  REJECTED: { label: "Rechazado", color: "bg-red-500" },
}

export default function ControlPagos() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMaterias, setSelectedMaterias] = useState({})
  const [paymentFile, setPaymentFile] = useState(null)

  // Datos de ejemplo - Reemplazar con datos reales de la API
  const materiasPorCiclo = {
    cicloJ: [
      { id: "J1", nombre: "Matemática I", creditos: 4, status: "PENDING" },
      { id: "J2", nombre: "Física I", creditos: 4, status: "APPROVED" },
      { id: "J3", nombre: "Química I", creditos: 3, status: "REJECTED" },
    ],
    cicloGeneral: [
      { id: "G1", nombre: "Cálculo I", creditos: 4, status: "PENDING" },
      { id: "G2", nombre: "Física II", creditos: 4, status: "PENDING" },
      { id: "G3", nombre: "Programación I", creditos: 3, status: "PENDING" },
    ],
    cicloProfesional: [
      { id: "P1", nombre: "Estructuras de Datos", creditos: 4, status: "PENDING" },
      { id: "P2", nombre: "Bases de Datos", creditos: 4, status: "PENDING" },
      { id: "P3", nombre: "Redes", creditos: 3, status: "PENDING" },
    ],
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
    setSelectedMaterias((prev) => ({
      ...prev,
      [materiaId]: !prev[materiaId],
    }))
  }

  const handleFileUpload = (event) => {
    setPaymentFile(event.target.files[0])
  }

  const handleSubmitPayment = async (event) => {
    event.preventDefault()
    // Implementar lógica de envío de pago
    console.log("Enviando pago...")
  }

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
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-[#004976]">Pensum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ciclo J */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ciclo J</h3>
                  <div className="space-y-2">
                    {materiasPorCiclo.cicloJ.map((materia) => (
                      <div
                        key={materia.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedMaterias[materia.id]}
                            onCheckedChange={() => handleMateriaSelection(materia.id)}
                          />
                          <span>{materia.nombre}</span>
                          <span className="text-sm text-gray-500">({materia.creditos} créditos)</span>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${PAYMENT_STATUS[materia.status].color}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ciclo General */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ciclo General</h3>
                  <div className="space-y-2">
                    {materiasPorCiclo.cicloGeneral.map((materia) => (
                      <div
                        key={materia.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedMaterias[materia.id]}
                            onCheckedChange={() => handleMateriaSelection(materia.id)}
                          />
                          <span>{materia.nombre}</span>
                          <span className="text-sm text-gray-500">({materia.creditos} créditos)</span>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${PAYMENT_STATUS[materia.status].color}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ciclo Profesional */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ciclo Profesional</h3>
                  <div className="space-y-2">
                    {materiasPorCiclo.cicloProfesional.map((materia) => (
                      <div
                        key={materia.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedMaterias[materia.id]}
                            onCheckedChange={() => handleMateriaSelection(materia.id)}
                          />
                          <span>{materia.nombre}</span>
                          <span className="text-sm text-gray-500">({materia.creditos} créditos)</span>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${PAYMENT_STATUS[materia.status].color}`} />
                      </div>
                    ))}
                  </div>
                </div>

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
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#004976]">Información de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monto">Monto</Label>
                    <Input id="monto" type="number" placeholder="0.00" required />
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
                    <Input
                      id="comprobante-file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("comprobante-file").click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Cargar
                    </Button>
                    <Button type="submit" className="w-full bg-[#004976]">
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