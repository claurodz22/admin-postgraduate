'use client'

// importa react y los hooks (useState y useEffects) invocalos
// en todas las vistas del jsx por si acaso
import React, { useState, useEffect } from 'react';

// estos son los componentes para navegar entre paginas, las tarjetas
// poder insertar las listas desplegables, y botones y demas
// todos estos se va guardando en la carpeta componentes
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen } from 'lucide-react';
import { urls } from '../urls';

const RegisterStudent = () => {
  const router = useRouter();

  const [estudiante, setEstudiante] = useState({
    nacionalidad: 'V',
    cedula: '',
    nombre_est: '',
    apellido_est: '',
    carrera: '',
    año_ingreso: '',
    estado_estudiante: '',
    cod_maestria: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [campo_activado, est_campo_activado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstudiante(prev => ({ ...prev, [name]: value }));
  };

  const handleCedulaChange = async () => {
    const cedula_completa = `${estudiante.nacionalidad}-${estudiante.cedula}`;
    
    setIsLoading(true);
    setMessage('');
    est_campo_activado(false);

    try {
      const response = await fetch(urls.obtenerdatosbasicos, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cedula: cedula_completa }),
      });

      const data = await response.json();

      if (response.ok) {
        setEstudiante(prev => ({
          ...prev,
          nombre_est: data.nombre || '',
          apellido_est: data.apellido || '',
          carrera: data.carrera || '',
          año_ingreso: data.año_ingreso || '',
          estado_estudiante: data.estado_estudiante || '',
          cod_maestria: data.cod_maestria || ''
        }));
        setMessage('Estudiante encontrado. Puede actualizar los datos.');
        est_campo_activado(true);
      } else {
        setMessage(data.message || 'Estudiante no encontrado.');
        est_campo_activado(false);
      }
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
      setMessage('Error al realizar la búsqueda.');
      est_campo_activado(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const userToSubmit = {
      cedula_estudiante: `${estudiante.nacionalidad}-${estudiante.cedula}`,
      nombre_est: estudiante.nombre_est,
      apellido_est: estudiante.apellido_est,
      carrera: estudiante.carrera,
      año_ingreso: estudiante.año_ingreso,
      estado_estudiante: estudiante.estado_estudiante,
      cod_maestria: estudiante.cod_maestria
    }

    try {
      const response = await fetch(urls.almacenarestudiante, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(userToSubmit),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el estudiante');
      }

      setMessage('Estudiante registrado/actualizado.');
      setEstudiante({
        nacionalidad: 'V',
        cedula: '',
        nombre_est: '',
        apellido_est: '',
        carrera: '',
        año_ingreso: '',
        estado_estudiante: '',
        cod_maestria: ''
      });
      est_campo_activado(false);
    } catch (error) {
      setMessage('Error al guardar el estudiante. Revise los datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/a-login-admin');
    }
  }, [router]);

  const menuItems = [
    { title: "Inicio", icon: Home, href: "/a-home-admin" },
    { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/a-register-user" },
    { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/a-register-student" },
    { title: "Control de Notas", icon: ClipboardList, href: "/a-control-notas" },
    { title: "Control de Pagos", icon: CreditCard, href: "/a-control-pagos" },
    { title: "Solicitudes Estudiantiles", icon: FileText, href: "/a-solicitudes-estudiantiles" }, 
    {title: "Asignar Materia", icon: BookOpen, href: "/a-asignar-materia" },
  ];

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
                localStorage.removeItem("token");
                router.push("/home-all");
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
                  <Link 
                    href={item.href} 
                    className="flex items-center px-6 py-2 text-[#004976] gap-3"
                  >
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
              <h2 className="text-2xl font-bold text-[#004976] mb-6 text-center">Registro/Actualización de Estudiante</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cedula_estudiante">Cédula Estudiante</Label>
                    <div className="flex">
                      <Select 
                        value={estudiante.nacionalidad}
                        onValueChange={(value) => setEstudiante(prev => ({ ...prev, nacionalidad: value }))}>
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
                        name="cedula"
                        type="number"
                        value={estudiante.cedula}
                        onChange={handleChange}
                        className="flex-1 ml-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="buscar_estudiante">Buscar Estudiante</Label>
                    <Button 
                      type="button" 
                      onClick={handleCedulaChange}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Buscando...' : 'Buscar'}
                    </Button>
                  </div>
                </div>

                {message && (
                  <p className={`text-${message.includes('encontrado') ? 'blue' : 'red'}-500 mt-2`}>
                    {message}
                  </p>
                )}

                <div>
                  <Label htmlFor="nombre_est">Nombre del Estudiante</Label>
                  <Input
                    type="text"
                    id="nombre_est"
                    name="nombre_est"
                    value={estudiante.nombre_est}
                    onChange={handleChange}
                    required
                    disabled={true}
                  />
                </div>
                <div>
                  <Label htmlFor="apellido_est">Apellido del Estudiante</Label>
                  <Input
                    type="text"
                    id="apellido_est"
                    name="apellido_est"
                    value={estudiante.apellido_est}
                    onChange={handleChange}
                    required
                    disabled={true}
                  />
                </div>

                
                <div>
                  <Label htmlFor="carrera">Carrera</Label>
                  <Select
                  id="carrera"
                  name="carrera"
                  type="text"
                  value={estudiante.carrera}
                  onValueChange={(value) => setEstudiante({ ...estudiante, carrera: value })}
                  disabled={!campo_activado}
                  >
                      <SelectTrigger>
                      <SelectValue placeholder="Seleccione carrera concluida" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Contaduría Pública">Contaduría Pública</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                      <SelectItem value="Ingeniería en Computación">Ingeniería en Computación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                
                <div>
                  <Label htmlFor="año_ingreso">Año de Egreso</Label>
                  <Input
                    type="number"
                    id="año_ingreso"
                    name="año_ingreso"
                    value={estudiante.año_ingreso}
                    onChange={handleChange}
                    min="2000"
                    max={new Date().getFullYear()}
                    required
                    disabled={!campo_activado}
                  />
                </div>
                <div>
                  <Label htmlFor="estado_estudiante">Estado</Label>
                  <Select 
                    name="estado_estudiante"
                    value={estudiante.estado_estudiante} 
                    onValueChange={(value) => handleChange({ target: { name: 'estado_estudiante', value } })}
                    disabled={!campo_activado}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cod_maestria">Código de Maestría</Label>
                  <Select
                  name="cod_maestria"
                  value={estudiante.cod_maestria}
                  onValueChange={(value) => setEstudiante({ ...estudiante, cod_maestria: value })}
                  disabled={!campo_activado}
                  >
                      <SelectTrigger>
                      <SelectValue placeholder="Seleccione maestría a realizar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8207">Gerencia de RRHH</SelectItem>
                      <SelectItem value="8306">Finanzas</SelectItem>
                      <SelectItem value="8327">Gerencia General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#004976] text-white hover:bg-[#003357]" 
                    disabled={isLoading || !campo_activado}
                  >
                    {isLoading ? 'Guardando...' : 'Registrar/Actualizar Estudiante'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default RegisterStudent;