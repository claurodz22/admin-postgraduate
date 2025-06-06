"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { menuItems } from "../../constants/menuItemsADM"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { urls } from "../urls"

export default function ListarUsuarios() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [selectedUserType, setSelectedUserType] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/administrador/a-login-admin")
    } else {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (selectedUserType) {
      fetchUsers(selectedUserType)
    }
  }, [selectedUserType])

  const fetchUsers = async (userType) => {
    setIsLoading(true)
    try {
      const userTypes = {
        Administrador: 1,
        Profesor: 3,
        Estudiante: 2,
      }

      const typeId = userTypes[userType]
      const response = await fetch(`${urls.listar_usuarios}?tipo_usuario=${typeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const formattedUsers = data.map((user) => ({
          cedula: user.cedula,
          nombre: user.nombre,
          apellido: user.apellido,
          tipo_usuario: getUserType(user.tipo_usuario),
          correo: user.correo,
        }))
        setUsers(formattedUsers)
      } else {
        console.error(`Error fetching ${userType}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getUserType = (typeId) => {
    switch (typeId) {
      case 1:
        return "Administrador"
      case 2:
        return "Estudiante"
      case 3:
        return "Profesor"
      default:
        return "Desconocido"
    }
  }

  const handleUserTypeChange = (value) => {
    setSelectedUserType(value)
    setCurrentPage(1)
  }

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(users.length / usersPerPage)

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

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
                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
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
          <Card className="max-w-5xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold text-[#004976] mb-4 text-center">Lista de Usuarios</h2>
              <div className="mb-4">
                <Select onValueChange={handleUserTypeChange} value={selectedUserType}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Seleccione tipo de usuario a enlistar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Profesor">Profesor</SelectItem>
                    <SelectItem value="Estudiante">Estudiante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedUserType && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cédula</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Tipo de Usuario</TableHead>
                        <TableHead>Correo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentUsers.map((user) => (
                        <TableRow key={user.cedula}>
                          <TableCell>{user.cedula}</TableCell>
                          <TableCell>{user.nombre}</TableCell>
                          <TableCell>{user.apellido}</TableCell>
                          <TableCell>{user.tipo_usuario}</TableCell>
                          <TableCell>{user.correo}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span>
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </>
              )}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => router.push("/administrador/a-home-admin")}
                  className="bg-[#004976] text-white hover:bg-[#003357]"
                >
                  Volver al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

