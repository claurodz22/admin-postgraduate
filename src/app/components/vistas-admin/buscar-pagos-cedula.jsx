'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, Search } from 'lucide-react';

// Simulated payment data
const allPayments = [
  { id: 1, bank: "Banco de Venezuela", reference: "REF123456", cedula: "V-12345678", amount: 150.00, date: "2023-06-15" },
  { id: 2, bank: "Banesco", reference: "REF234567", cedula: "V-23456789", amount: 200.50, date: "2023-06-14" },
  { id: 3, bank: "Mercantil", reference: "REF345678", cedula: "E-34567890", amount: 175.25, date: "2023-06-13" },
  { id: 4, bank: "Provincial", reference: "REF456789", cedula: "V-45678901", amount: 300.00, date: "2023-06-12" },
  { id: 5, bank: "Banco del Tesoro", reference: "REF567890", cedula: "E-56789012", amount: 125.75, date: "2023-06-11" },
  // ... add more simulated payments
];

export default function BusquedaPagos() {
  const router = useRouter()
  const [cedulaTipo, setCedulaTipo] = useState('V')
  const [cedulaNumero, setCedulaNumero] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/home-admin" },
    { title: "Registro de Usuarios Nuevos", icon: UserPlus, href: "/register-user" },
    { title: "Registro de Estudiantes", icon: GraduationCap, href: "/register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/solicitudes-estudiantiles" },
  ];

  const handleSearch = (e) => {
    e.preventDefault()
    const cedula = `${cedulaTipo}-${cedulaNumero}`
    // Simulated search logic
    const results = allPayments.filter(payment => {
      const cedulaMatch = cedulaNumero ? payment.cedula.includes(cedula) : true
      const dateMatch = (fechaInicio && fechaFin) ? 
        (payment.date >= fechaInicio && payment.date <= fechaFin) : true
      return cedulaMatch && dateMatch
    })
    setSearchResults(results)
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
          <Card className="mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Búsqueda de Pagos</h2>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cedula">Cédula</Label>
                  <div className="flex">
                    <Select 
                      value={cedulaTipo} 
                      onValueChange={setCedulaTipo}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="V">V-</SelectItem>
                        <SelectItem value="E">E-</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="cedula"
                      value={cedulaNumero}
                      onChange={(e) => setCedulaNumero(e.target.value)}
                      placeholder="Ej: 12345678"
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fechaFin">Fecha de Fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
                <Button type="submit" className="md:col-span-3 bg-[#004976] text-white hover:bg-[#003357]">
                  <Search className="mr-2 h-4 w-4" /> Buscar Pagos
                </Button>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha del Pago</TableHead>
                        <TableHead>Banco</TableHead>
                        <TableHead>Número de Referencia</TableHead>
                        <TableHead>Cédula</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{new Date(payment.date).toLocaleDateString('es-VE')}</TableCell>
                          <TableCell>{payment.bank}</TableCell>
                          <TableCell>{payment.reference}</TableCell>
                          <TableCell>{payment.cedula}</TableCell>
                          <TableCell className="text-right">{payment.amount.toFixed(2)} Bs.</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {searchResults.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No se encontraron resultados.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

