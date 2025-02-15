'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Page() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Encabezado de la página */}
      <header className="bg-[#004976] px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/Logo_UDO.svg.png"
              alt="Logo_UDO"
              width={60}
              height={60}
              className="rounded-full bg-white p-1"
            />
            <div className="text-white">
              <h1 className="text-xl font-bold">UNIVERSIDAD DE ORIENTE</h1>
              <p className="text-sm">NÚCLEO DE ANZOÁTEGUI</p>
              <p className="text-xs">SIGPCA</p>
            </div>
          </div>
          <div className="text-white text-right">
            <p>{currentTime.toLocaleDateString()}</p>
            <p>{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
      </header>

      {/* Cuerpo principal de la página */}
      <main className="flex-grow mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 rounded-lg bg-gray-100 p-4 text-center">
          <h2 className="text-2xl font-bold text-[#004976]">
            SISTEMA INTEGRAL DE GESTIÓN DEL POSTGRADO DE CIENCIAS ADMINISTRATIVAS (SIGPCA)
          </h2>
        </div>

        {/* Role Selection Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border border-gray-200 transition-transform hover:scale-105">
            <CardContent className="flex flex-col items-center p-6">
              <GraduationCap className="mb-4 h-12 w-12 text-[#004976]" />
              <h3 className="mb-4 text-xl font-bold text-[#004976]">Estudiantes</h3>
              <Button asChild className="w-full bg-[#e85d04] hover:bg-[#dc5303]">
                <Link href="/estudiantes">Ingresar como Estudiante</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 transition-transform hover:scale-105">
            <CardContent className="flex flex-col items-center p-6">
              <Users className="mb-4 h-12 w-12 text-[#004976]" />
              <h3 className="mb-4 text-xl font-bold text-[#004976]">Profesores</h3>
              <Button asChild className="w-full bg-[#e85d04] hover:bg-[#dc5303]">
                <Link href="/p-login-profe">Ingresar como Profesor</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 transition-transform hover:scale-105">
            <CardContent className="flex flex-col items-center p-6">
              <ShieldCheck className="mb-4 h-12 w-12 text-[#004976]" />
              <h3 className="mb-4 text-xl font-bold text-[#004976]">Administración</h3>
              <Button asChild className="w-full bg-[#e85d04] hover:bg-[#dc5303]">
                <Link href="/a-login-admin">Ingresar como Administrador</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Botón de Recuperar Contraseña */}
        <div className="mt-8 text-center">
          <Button asChild className="bg-[#004976] text-white hover:bg-[#003f66] px-6 py-3 rounded-md">
            <Link href="/h-recuperar-contrasena">Recuperar Contraseña</Link>
          </Button>
        </div>

        {/* Descripción */}
        <div className="mt-12 rounded-lg bg-gray-100 p-6">
          <h3 className="mb-4 text-xl font-bold text-[#004976]">Acerca de este portal</h3>
          <p className="text-lg text-gray-700">
            Esta página permite a la población estudiantil mantener una constancia de su proceso de estudios de
            postgrado en el área administrativa de la Universidad de Oriente. Aquí podrás acceder a información
            importante, realizar trámites y dar seguimiento a tu progreso académico.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004976] text-white py-4 px-4 mt-8">
        <div className="mx-auto max-w-7xl text-center">
          <p>©2024 | Universidad de Oriente :: Venezuela</p>
          <p className="text-sm mt-2">Propuesta de los estudiantes pertenecientes a DSA</p>
        </div>
      </footer>
    </div>
  );
}
