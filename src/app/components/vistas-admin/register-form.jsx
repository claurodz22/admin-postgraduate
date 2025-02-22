"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Home,
  UserPlus,
  GraduationCap,
  ClipboardList,
  CreditCard,
  FileText,
  BookOpen,
  EyeIcon,
  EyeIcon as EyeClosedIcon,
} from "lucide-react"
import { urls } from "../urls"

export default function RegisterUser() {
  const router = useRouter()

  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    cedulaTipo: "V-",
    cedulaNumero: "",
    correo: "",
    tipoUsuario: "",
    password: "",
    confirmPassword: "",
  })

  const [passwordError, setPasswordError] = useState("")
  const [formError, setFormError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userFound, setUserFound] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // Nuevo estado para alternar la visibilidad de la contraseña

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/a-login-admin")
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "nombre" || name === "apellido") {
      // Only allow letters and spaces
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "")
      setUser((prev) => ({ ...prev, [name]: onlyLetters }))
    } else {
      setUser((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (value) => {
    setUser((prev) => ({ ...prev, tipoUsuario: value }))
  }

  const handleSearch = async () => {
    setIsLoading(true)
    setFormError("")
    setUserFound(false)
    setSearchPerformed(true)
    // awaint es solo valido en funciones asynchronously
    // if === true
    const fullCedula = `${user.cedulaTipo}${user.cedulaNumero}`
    try {
      const response = await fetch(urls.datosbasicos, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ cedula: fullCedula }),
      })

      const result = await response.json()
      console.log("API datos:", result)

      if (response.ok && result.data) {
        const userData = result.data
        setUser((prev) => ({
          ...prev,
          nombre: userData.nombre || prev.nombre,
          apellido: userData.apellido || prev.apellido,
          correo: userData.correo || prev.correo,
          password: userData.contraseña || prev.contraseña,
          tipoUsuario: userData.tipo_usuario
            ? ["", "administrativo", "estudiante", "profesor"][userData.tipo_usuario]
            : prev.tipoUsuario,
        }))
        setUserFound(true)
        setFormError(result.message || "Usuario encontrado. Puede actualizar los datos.")
      } else {
        setFormError(result.message || "Usuario no encontrado. Por favor, complete el registro.")
      }
    } catch (error) {
      console.error("Error (p1):", error) // Muestra el error completo en consola
      setFormError(`Error: ${error.message || "Algo salió mal"}.`) // Muestra un mensaje más útil en el formulario
    } finally {
      setIsLoading(false) // Detiene el estado de carga independientemente de si hubo un error o no
    }
  }

  const validatePassword = (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasNonalphas = /\W/.test(password)
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (user.password !== user.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden")
      return
    }
    if (!validatePassword(user.password)) {
      setPasswordError("La contraseña no cumple con los requisitos")
      return
    }

    setPasswordError("")
    setFormError("")

    const fullCedula = `${user.cedulaTipo}${user.cedulaNumero}`

    let tipoUsuarioValue
    switch (user.tipoUsuario) {
      case "administrativo":
        tipoUsuarioValue = 1
        break
      case "estudiante":
        tipoUsuarioValue = 2
        break
      case "profesor":
        tipoUsuarioValue = 3
        break
      default:
        tipoUsuarioValue = 2
        break
    }

    const userToSubmit = {
      nombre: user.nombre,
      apellido: user.apellido,
      cedula: fullCedula,
      correo: user.correo,
      tipo_usuario: tipoUsuarioValue,
      contraseña: user.password,
    }

    setIsLoading(true)

    try {
      const response = await fetch(urls.datosbasicos, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToSubmit),
      })

      const result = await response.json()

      if (response.ok) {
        setUser({
          nombre: "",
          apellido: "",
          cedulaTipo: "V-",
          cedulaNumero: "",
          correo: "",
          tipoUsuario: "",
          password: "",
          confirmPassword: "",
        })
        alert("Usuario registrado con éxito!")
        router.push("/a-home-admin")
      } else {
        setFormError(result.message || "Ocurrió un error al registrar el usuario")
      }
    } catch (error) {
      setFormError("Hubo un problema con la solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" },
    { title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ]

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
          <Card className="max-w-3xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Registro/Actualización de Usuario</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cedula_estudiante">Cédula Estudiante</Label>
                    <div className="flex">
                      <Select
                        value={user.cedulaTipo}
                        onValueChange={(value) => setUser((prev) => ({ ...prev, cedulaTipo: value }))}
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
                        className="flex-1 ml-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="buscar_estudiante">Buscar Estudiante</Label>
                    <Button type="button" onClick={handleSearch} disabled={isLoading} className="w-full">
                      {isLoading ? "Buscando..." : "Buscar"}
                    </Button>
                  </div>
                </div>

                {searchPerformed && <p className={`text-${userFound ? "blue" : "red"}-500 mt-2`}>{formError}</p>}

                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={user.nombre}
                    onChange={handleChange}
                    required
                    disabled={!searchPerformed}
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
                    disabled={!searchPerformed}
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
                    disabled={!searchPerformed}
                  />
                </div>
                <div>
                  <Label htmlFor="tipoUsuario">Tipo de Usuario</Label>
                  <Select onValueChange={handleSelectChange} value={user.tipoUsuario} disabled={!searchPerformed}>
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
                <div style={{ display: "flex" }}>
                  <div style={{ width: "90%" }}>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"} // Cambia el tipo dinámicamente
                      autoComplete="current-password"
                      value={user.password}
                      onChange={handleChange}
                      required
                      //disabled={!searchPerformed}
                    />
                  </div>
                  <button
                    style={{ height: "40px", marginTop: "auto" }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#004976] p-2"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {!showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                  </button>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "90%" }}>
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"} // Cambia el tipo dinámicamente
                      autoComplete="current-password"
                      //value={""}
                      onChange={handleChange}
                      required
                      disabled={!searchPerformed}
                    />
                  </div>
                  <button
                    style={{ height: "40px", marginTop: "auto" }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#004976] p-2"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {!showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                  </button>
                </div>
                {passwordError && <p className="text-red-500">{passwordError}</p>}
                <p className="text-sm text-gray-500">
                  La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres
                  especiales.
                </p>
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-8">
                    <Button asChild variant="outline">
                      <Link href="/a-home-admin">Atrás (Menú Principal)</Link>
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#004976] text-white hover:bg-[#003357]"
                      disabled={isLoading || !searchPerformed}
                    >
                      {isLoading ? "Registrando..." : "Registrar Usuario"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

