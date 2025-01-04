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
import Image from "next/image"
import Link from "next/link"
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, CalendarIcon } from 'lucide-react'

/* opciones de maestria posible*/
const MAESTRIA_OPTIONS = {
  GG: 'Cs Administrativas / Gerencia General (GG)',
  FI: 'Cs Administrativas / Finanzas (FI)',
  RRHH: 'Cs Administrativas / Gerencia de Recursos Humanos (RRHH)' 
}

/* opciones de sede posible */
const SEDE_OPTIONS = {
  barcelona: 'Barcelona',
  cantaura: 'Cantaura'
}

/* se le coloca el const para que no sean modificadas despues
ambas vars [MAESTRIA_OPTIONS] y [SEDE_OPTIONS] se utilizan
posteriormente para la generación del código del cohorte*/

export default function CreacionDecohorte() {
  /* Variables de estado utilizadas en el código */
  const router = useRouter()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [maestria, setMaestria] = useState('')
  const [sede, setSede] = useState('')
  const [codigo, setCodigo] = useState('')

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro de Usuarios Nuevos", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro de Estudiantes", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" },
  ];

  /* Definición de la función generateCódigo
  esta con el objetivo que de acuerdo a lo escogido por el
  usuario se cree un identificador único por cohorte.
  Se recuerda que se debe de verificar en la BDD si existe
  una con el mismo código*/
  const generateCodigo = () => {
    if (!maestria || !sede || !startDate) return

    const sedeCode = sede === 'barcelona' ? 'I' : 'II'
    const year = startDate.getFullYear()
    
    const section = 'A'

    setCodigo(`${maestria}${sedeCode}${section}-${year}`)
  }

  /* Se utiliza para redirigir al usuario
  en caso de no poseer token de acceso*/
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])


  /* recuerda en esta parte añadir la API para poder almacenar 
  el código del cohorte en la BDD*/
  const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log({ startDate, endDate, maestria, sede, codigo })
    
    router.push('/a-control-notas')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* encabezado */}
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
        {/* menu de la izquierda */}
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

        {/* creación del cohorte, contenido
        lo siguiente representa el formulario que de acuerdo
        a los datos ingresados y pasados a la función generateCodigo
        crea el código del cohorte */}
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
                    <Button type="button" onClick={generateCodigo} className="bg-[#004976] text-white hover:bg-[#003357]" disabled={!startDate}>
                      Generar
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#004976] text-white hover:bg-[#003357]">
                  Guardar cohorte
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

