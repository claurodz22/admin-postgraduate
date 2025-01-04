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

// Simulated function to fetch student data
const fetchStudentData = async (cedula) => {
  // In a real application, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  // Dummy data for demonstration
  const students = {
    'V-12345678': { nombre: 'Juan Pérez', carrera: 'Ingeniería Informática', anio_ingreso: '2020' },
    'V-87654321': { nombre: 'María González', carrera: 'Medicina', anio_ingreso: '2019' },
  };

  return students[cedula] || null;
};

export default function RegisterStudent() {
  const router = useRouter()

  /*
    variables para completar el registro 
    de los estudiantes
  */
  const [estudiante, setEstudiante] = useState({
    cedula_estudiante: '',
    nombre_estudiante: '',
    carrera: '',
    anio_ingreso: '',
    estado: ''
  })

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setEstudiante(prev => ({ ...prev, [name]: value }))
  }

  const handleCedulaChange = async (e) => {
    const cedula = e.target.value;
    setEstudiante(prev => ({ ...prev, cedula_estudiante: cedula }));

    if (cedula.length >= 8) { // Assuming a minimum length for a valid cedula
      setIsLoading(true);
      try {
        const studentData = await fetchStudentData(cedula);
        if (studentData) {
          setEstudiante(prev => ({
            ...prev,
            nombre_estudiante: studentData.nombre,
            carrera: studentData.carrera,
            anio_ingreso: studentData.anio_ingreso
          }));
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/a-login-admin')
    }
  }, [router])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar el estudiante en la base de datos
    console.log('Estudiante guardado:', estudiante)
    // Resetear el formulario después de guardar
    setEstudiante({
      cedula_estudiante: '',
      nombre_estudiante: '',
      carrera: '',
      anio_ingreso: '',
      estado: ''
    })
    alert('Estudiante registrado con éxito!')
  }

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
      {/* encabezado de la pagina */}
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
        {/* menu izquierdo de la pag*/ }
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

        {/* cuerpo principal de la pag */ }
        <main className="flex-1 p-6">
          <Card className="max-w-3xl mx-auto bg-[#FFEFD5]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Registro de Estudiante</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cedula_estudiante">Cédula Estudiante</Label>
                    <div className="flex">
                      <Select 
                        value={estudiante.cedula_estudiante.split('-')[0] || 'V'}
                        onValueChange={(value) => setEstudiante(prev => ({ ...prev, cedula_estudiante: `${value}-${prev.cedula_estudiante.split('-')[1] || ''}` }))}
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
                        id="cedula_estudiante"
                        name="cedula_estudiante"
                        type="text"
                        value={estudiante.cedula_estudiante.split('-')[1] || ''}
                        onChange={(e) => handleCedulaChange({ target: { value: `${estudiante.cedula_estudiante.split('-')[0]}-${e.target.value}` } })}
                        className="flex-1 ml-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="buscar_estudiante">Buscar Estudiante</Label>
                    <Button 
                      type="button" 
                      onClick={() => handleCedulaChange({ target: { value: estudiante.cedula_estudiante } })}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Buscando...' : 'Buscar'}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="nombre_estudiante">Nombre del Estudiante</Label>
                  <Input
                    type="text"
                    id="nombre_estudiante"
                    name="nombre_estudiante"
                    value={estudiante.nombre_estudiante}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="carrera">Carrera</Label>
                  <Input
                    type="text"
                    id="carrera"
                    name="carrera"
                    value={estudiante.carrera}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="anio_ingreso">Año de Ingreso</Label>
                  <Input
                    type="number"
                    id="anio_ingreso"
                    name="anio_ingreso"
                    value={estudiante.anio_ingreso}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select name="estado" value={estudiante.estado} onValueChange={(value) => handleChange({ target: { name: 'estado', value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-8">
                    <Button asChild variant="outline">
                      <Link href="/a-home-admin">Atrás (Menú Principal)</Link>
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

