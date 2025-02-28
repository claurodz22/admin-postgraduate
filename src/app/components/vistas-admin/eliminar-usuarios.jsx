"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { menuItems } from "../../constants/menuItemsADM"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EliminarUsuarios() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState({ administradores: [], estudiantes: [], profesores: [] })
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedRole, setSelectedRole] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/administrador/a-login-admin")
    } else {
      fetchUsers()
    }
  }, [router])

  const fetchUsers = () => {
    // Simula una llamada a la API
    setUsers({
      administradores: [
        { id: 1, nombre: "Admin 1", email: "admin1@udo.edu" },
        { id: 2, nombre: "Admin 2", email: "admin2@udo.edu" },
        // ... más administradores
      ],
      estudiantes: [
        { id: 3, nombre: "Estudiante 1", email: "estudiante1@udo.edu" },
        { id: 4, nombre: "Estudiante 2", email: "estudiante2@udo.edu" },
        // ... más estudiantes
      ],
      profesores: [
        { id: 5, nombre: "Profesor 1", email: "profesor1@udo.edu" },
        { id: 6, nombre: "Profesor 2", email: "profesor2@udo.edu" },
        // ... más profesores
      ],
    })
    setIsLoading(false)
  }

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleDeleteUsers = () => {
    console.log("Usuarios a eliminar:", selectedUsers)
    alert("Usuarios eliminados (simulación)")
    setSelectedUsers([])
  }

  const handleRoleChange = (value) => {
    setSelectedRole(value)
    setCurrentPage(1)
    setSelectedUsers([])
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  const currentUsers = selectedRole
    ? users[selectedRole].slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
    : []
  const totalPages = selectedRole ? Math.ceil(users[selectedRole].length / usersPerPage) : 0

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
        {/* menu con los items de arriba */}
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

        {/* Contenido principal */}
        <main className="flex-1 p-6">
          <Card className="max-w-5xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold text-[#004976] mb-4 text-center">Eliminar Usuarios</h2>
              <div className="mb-4">
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administradores">Administradores</SelectItem>
                    <SelectItem value="estudiantes">Estudiantes</SelectItem>
                    <SelectItem value="profesores">Profesores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedRole && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Seleccionar</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleCheckboxChange(user.id)}
                            />
                          </TableCell>
                          <TableCell>{user.nombre}</TableCell>
                          <TableCell>{user.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                </>
              )}
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={handleDeleteUsers}
                  className="bg-red-600 text-white hover:bg-red-700"
                  disabled={selectedUsers.length === 0}
                >
                  Eliminar Seleccionados
                </Button>
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

