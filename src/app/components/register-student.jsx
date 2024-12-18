'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, ChevronDown } from 'lucide-react';

export default function RegisterUser() {
  const router = useRouter()

  const [estudiante, setEstudiante] = useState({
    cedula_estudiante: '',
    id_usuario: '',
    nombre_estudiante: '',
    carrera: '',
    anio_ingreso: '',
    estado: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setEstudiante(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar el estudiante en la base de datos
    console.log('Estudiante guardado:', estudiante)
    // Resetear el formulario después de guardar
    setEstudiante({
      cedula_estudiante: '',
      id_usuario: '',
      numero_estudiante: '',
      carrera: '',
      anio_ingreso: '',
      estado: ''
    })
    alert('Estudiante registrado con éxito!')
  }

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/home-admin" },
    { title: "Registro de Usuarios Nuevos", icon: UserPlus, href: "/register-user" },
    { title: "Registro de Estudiantes", icon: GraduationCap, href: "/register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/grades" },
    { title: "Control de Pagos", icon: CreditCard, href: "/pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/request" },
  ];

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
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Card className="max-w-3xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Registro de Estudiante</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cedula_estudiante" className="block text-sm font-medium text-gray-700 mb-1">
                      Cedula Estudiante
                    </label>
                    <input
                      id="cedula_estudiante"
                      name="cedula_estudiante"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="on"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="nombre_estudiante" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Estudiante
                  </label>
                  <input
                    type="text"
                    id="nombre_estudiante"
                    name="nombre_estudiante"
                    value={estudiante.nombre_estudiante}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="carrera" className="block text-sm font-medium text-gray-700 mb-1">
                    Carrera
                  </label>
                  <input
                    type="text"
                    id="carrera"
                    name="carrera"
                    value={estudiante.carrera}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="anio_ingreso" className="block text-sm font-medium text-gray-700 mb-1">
                    Año de Ingreso
                  </label>
                  <input
                    type="number"
                    id="anio_ingreso"
                    name="anio_ingreso"
                    value={estudiante.anio_ingreso}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <div className="relative">
                    <select
                      id="estado"
                      name="estado"
                      value={estudiante.estado}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md appearance-none bg-white"
                      required
                    >
                      <option value="">Seleccione un estado</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-8">
                    <Button asChild variant="outline">
                      <Link href="/home-admin">Atrás (Menú Principal)</Link>
                    </Button>
                    <Button type="submit" className="bg-[#004976] text-white hover:bg-[#003357]">
                      Guardar Estudiante
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

