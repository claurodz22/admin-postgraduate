'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover,  PopoverContent,  PopoverTrigger, } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen, CalendarIcon, AlertCircle } from 'lucide-react'
import { urls } from '../urls'

const MAESTRIA_OPTIONS = {
  GG: 'Cs Administrativas / Gerencia General (GG)',
  FI: 'Cs Administrativas / Finanzas (FI)',
  RH: 'Cs Administrativas / Gerencia de Recursos Humanos (RRHH)' 
}

const SEDE_OPTIONS = {
  barcelona: 'Barcelona',
  cantaura: 'Cantaura'
}

export default function CreacionDecohorte() {
  const router = useRouter()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [maestria, setMaestria] = useState('')
  const [sede, setSede] = useState('')
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState('')

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" }, 
    {title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ];

  const generateCodigo = () => {
    if (!maestria || !sede || !startDate) return

    const sedeCode = sede === 'barcelona' ? 'I' : 'II'
    const year = startDate.getFullYear()
    const section = 'A'

    setCodigo(`${maestria}${sedeCode}${section}-${year}`)
    setIsVerified(false)
    setVerificationMessage('')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])

  // Sincronizar fecha de fin automáticamente al seleccionar fecha de inicio
  useEffect(() => {
    if (startDate) {
      const calculatedEndDate = new Date(startDate);
      calculatedEndDate.setFullYear(calculatedEndDate.getFullYear() + 4); // Sumar 4 años
      setEndDate(calculatedEndDate);
    }
  }, [startDate]); // Dependencia: `startDate`

  const verifyCohorte = async () => {
    if (!codigo) {
      alert('Por favor, genera un código de cohorte primero.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(urls.verificarCodigoCohort, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo_cohorte: codigo }),
      })

      const result = await response.json()

      if (response.ok) {
        if (result.exists) {
          setVerificationMessage(`El código ${codigo} ya existe. Se utilizará ${result.new_code} en su lugar.`)
          setCodigo(result.new_code)
        } else {
          setVerificationMessage('El código de cohorte es único y puede ser utilizado.')
        }
        setIsVerified(true)
      } else {
        setVerificationMessage(result.error || 'Error al verificar el código de cohorte')
        setIsVerified(false)
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error)
      setVerificationMessage('Error en la comunicación con el servidor')
      setIsVerified(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isVerified) {
      alert('Por favor, verifica el código de cohorte antes de guardar.')
      return
    }

    setLoading(true)

    const data = {
      codigo_cohorte: codigo,
      fecha_inicio: format(startDate, "yyyy-MM-dd"),
      fecha_fin: format(endDate, "yyyy-MM-dd"),
      sede_cohorte: sede,
      tipo_maestria: maestria,
    }

    try {
      const response = await fetch(urls.cohorte_generar_codigo, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Cohorte guardado exitosamente con el código: ${result.codigo_cohorte}`)
        router.push('/a-home-admin')  // Redirect to admin home page
      } else {
        alert(result.error || 'Error al guardar el cohorte')
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error)
      alert('Error en la comunicación con el servidor')
    } finally {
      setLoading(false)
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
          <Card className="max-w-3xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Creación de cohorte</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Fin</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maestria">Tipo de Maestría</Label>
                  <Select onValueChange={setMaestria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Maestría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MAESTRIA_OPTIONS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sede">Sede</Label>
                  <Select onValueChange={setSede}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SEDE_OPTIONS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código de cohorte</Label>
                  <div className="flex space-x-2">
                    <Input id="codigo" value={codigo} readOnly className="flex-grow" />
                    <Button type="button" onClick={generateCodigo} className="bg-[#004976] text-white hover:bg-[#003357]" disabled={!startDate || !maestria || !sede}>
                      Generar
                    </Button>
                    <Button type="button" onClick={verifyCohorte} className="bg-[#004976] text-white hover:bg-[#003357]" disabled={!codigo || loading}>
                      Verificar
                    </Button>
                  </div>
                </div>

                {verificationMessage && (
                  <Alert variant={isVerified ? "default" : "destructive"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{isVerified ? "Verificación Exitosa" : "Error de Verificación"}</AlertTitle>
                    <AlertDescription>{verificationMessage}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-[#004976] text-white hover:bg-[#003357]" disabled={loading || !isVerified}>
                  {loading ? 'Guardando...' : 'Guardar cohorte'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

