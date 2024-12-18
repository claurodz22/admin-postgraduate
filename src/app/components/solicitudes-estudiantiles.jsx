import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

// Datos de ejemplo
const solicitudes = [
    { codigo: 'SOL001', cedula: '1234567890', nombre: 'Cambio de horario', descripcion: 'Solicitud para cambiar el horario de clases', status: 'no revisado' },
    { codigo: 'SOL002', cedula: '0987654321', nombre: 'Extensión de plazo', descripcion: 'Solicitud de extensión para entrega de proyecto', status: 'en revision' },
    { codigo: 'SOL003', cedula: '1122334455', nombre: 'Convalidación', descripcion: 'Solicitud para convalidar materias', status: 'revisado' },
  ]

export default function SolicitudesEstudiantiles() {
  return (
    <><div className="container mx-auto py-10">
      <CardContent>
        <h1 className="text-2xl font-bold text-center">Solicitudes Estudiantiles</h1>
      </CardContent>


      <Table>
        <TableCaption>Lista de solicitudes estudiantiles actuales</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Nombre de la Solicitud</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitudes.map((solicitud) => (
            <TableRow key={solicitud.codigo}>
              <TableCell className="font-medium">{solicitud.codigo}</TableCell>
              <TableCell>{solicitud.cedula}</TableCell>
              <TableCell>{solicitud.nombre}</TableCell>
              <TableCell>{solicitud.descripcion}</TableCell>
              <TableCell>
                <Badge
                  variant={solicitud.status === 'no revisado' ? 'destructive' :
                    solicitud.status === 'en revision' ? 'default' : 'success'}
                >
                  {solicitud.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div><div className="flex items-center space-x-8"> {/* Quita justify-between, usa space-x-8 */}
        <Button asChild>
          <Link href="/home-admin">Atrás (Menú Principal)</Link>
        </Button>
      </div></>
  )
}
