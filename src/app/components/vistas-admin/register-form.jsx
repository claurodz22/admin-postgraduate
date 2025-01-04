'use client'

import { useState, useEffect } from 'react'
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
  
  /* declaración de variables del formulario
    todos inicializados en vacío a excepción de
    la nacionalidad, estas variables se rellenan
    en el formulario y posteriormente enviadas
    a la bdd
  */
  const [user, setUser] = useState({
    nombre: '',
    apellido: '',
    cedulaTipo: 'V-',
    cedulaNumero: '',
    correo: '',
    tipoUsuario: '',
    password: '',
    confirmPassword: ''
  })

  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /* redirige a la pagina de inicio
  si el usuario no posee un tokem */
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setUser(prev => ({ ...prev, tipoUsuario: value }))
  }

  /*
    Definición de función validatePassword, esta
    con el objetivo de que cumpla con los 
    parametros de seguridad
  */
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    /*
      Utilizado para verificar que la
      contraseña sea la misma
    */
    if (user.password !== user.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }
    if (!validatePassword(user.password)) {
      setPasswordError('La contraseña no cumple con los requisitos')
      return
    }

    setPasswordError('')
    setFormError('')
    /* concatenar la nacionalidad  con la cedula */
    const fullCedula = `${user.cedulaTipo}${user.cedulaNumero}`


    /* transformar el tipo de usuario a un valor numérico 
    para la bdd esta parte es clave */
    let tipoUsuarioValue;
    switch (user.tipoUsuario) {
      case 'administrativo':
        tipoUsuarioValue = 1;
        break;
      case 'estudiante':
        tipoUsuarioValue = 2;
        break;
      case 'profesor':
        tipoUsuarioValue = 3;
        break;
      default:
        tipoUsuarioValue = 2;
        break;
    }

    const userToSubmit = {
      nombre: user.nombre,
      apellido: user.apellido,
      cedula: fullCedula,
      correo: user.correo,
      tipo_usuario: tipoUsuarioValue,
      contraseña: user.password
    }

    setIsLoading(true)

    /*
      luego con todos los datos se hace un post (envío/crear) datos
      en la bdd
    */

    try {
      const response = await fetch('http://127.0.0.1:8000/api/datosbasicos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToSubmit),
      })

      const result = await response.json()

      if (response.ok) {
        setUser({
          nombre: '',
          apellido: '',
          cedulaTipo: 'V-',
          cedulaNumero: '',
          correo: '',
          tipoUsuario: '',
          password: '',
          confirmPassword: ''
        })
        alert('Usuario registrado con éxito!')
        router.push("/a-home-admin")
      } else {
        setFormError(result.error || 'Ocurrió un error al registrar el usuario')
      }
    } catch (error) {
      setFormError('Hubo un problema con la solicitud')
    } finally {
      setIsLoading(false)
    }
  }

  /* opcs del menu */
  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro de Usuarios Nuevos", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro de Estudiantes", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" },
  ];

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
        {/* menu izquierdo */}
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

        {/* formulario para el registro de usuarios 
        nuevos en la app web */}
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
                  <div className="flex">
                    <Select 
                      value={user.cedulaTipo} 
                      onValueChange={(value) => setUser(prev => ({ ...prev, cedulaTipo: value }))} 
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="V-">V-</SelectItem>
                        <SelectItem value="E-">E-</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="cedulaNumero"
                      name="cedulaNumero"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={user.cedulaNumero}
                      onChange={handleChange}
                      required
                      className="flex-1 ml-2"
                    />
                  </div>
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
                      <SelectItem value="administrativo">Administrador</SelectItem>
                      <SelectItem value="estudiante">Estudiante</SelectItem>
                      <SelectItem value="profesor">Profesor</SelectItem>
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
                {formError && <p className="text-red-500">{formError}</p>}
                <p className="text-sm text-gray-500">
                  La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.
                </p>
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-8">
                    <Button asChild variant="outline">
                      <Link href="/a-home-admin">Atrás (Menú Principal)</Link>
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#004976] text-white hover:bg-[#003357]"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registrando...' : 'Registrar Usuario'}
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

