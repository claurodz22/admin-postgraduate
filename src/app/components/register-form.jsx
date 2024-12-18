'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText } from 'lucide-react';

export default function RegisterUser() {
  const router = useRouter()

  const [user, setUser] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    correo: '',
    tipoUsuario: '',
    password: '',
    confirmPassword: ''
  })

  const [passwordError, setPasswordError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setUser(prev => ({ ...prev, tipoUsuario: value }))
  }

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (user.password !== user.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }
    if (!validatePassword(user.password)) {
      setPasswordError('La contraseña no cumple con los requisitos')
      return
    }
    // Aquí iría la lógica para guardar el usuario en la base de datos
    console.log('Usuario guardado:', user)
    // Resetear el formulario después de guardar
    setUser({
      nombre: '',
      apellido: '',
      cedula: '',
      correo: '',
      tipoUsuario: '',
      password: '',
      confirmPassword: ''
    })
    setPasswordError('')
    alert('Usuario registrado con éxito!')
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
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Registro de Usuario</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={user.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={user.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cedula">Cédula</Label>
                  <Input
                    id="cedula"
                    name="cedula"
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={user.cedula}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="correo">Correo Electrónico</Label>
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    value={user.correo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipoUsuario">Tipo de Usuario</Label>
                  <Select onValueChange={handleSelectChange} value={user.tipoUsuario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo de usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estudiante">Estudiante</SelectItem>
                      <SelectItem value="profesor">Profesor</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {passwordError && <p className="text-red-500">{passwordError}</p>}
                <p className="text-sm text-gray-500">
                  La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.
                </p>
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-8">
                    <Button asChild variant="outline">
                      <Link href="/home-admin">Atrás (Menú Principal)</Link>
                    </Button>
                    <Button type="submit" className="bg-[#004976] text-white hover:bg-[#003357]">
                      Registrar Usuario
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

