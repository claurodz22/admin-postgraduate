'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText } from 'lucide-react';

// Simulated payment data with dates
const payments = [
  { id: 1, bank: "Banco de Venezuela", reference: "REF123456", cedula: "V-12345678", amount: 150.00, date: "2023-06-15" },
  { id: 2, bank: "Banesco", reference: "REF234567", cedula: "V-23456789", amount: 200.50, date: "2023-06-14" },
  { id: 3, bank: "Mercantil", reference: "REF345678", cedula: "E-34567890", amount: 175.25, date: "2023-06-13" },
  { id: 4, bank: "Provincial", reference: "REF456789", cedula: "V-45678901", amount: 300.00, date: "2023-06-12" },
  { id: 5, bank: "Banco del Tesoro", reference: "REF567890", cedula: "E-56789012", amount: 125.75, date: "2023-06-11" },
  // ... add more simulated payments up to 25
];

export default function ControlPagos() {
  const router = useRouter()

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/home-admin" },
    { title: "Registro de Usuarios Nuevos", icon: UserPlus, href: "/register-user" },
    { title: "Registro de Estudiantes", icon: GraduationCap, href: "/register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/solicitudes-estudiantiles" },
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
          <Card className="mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Últimos 25 Pagos Ingresados</h2>
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
                    {payments.map((payment) => (
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
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
