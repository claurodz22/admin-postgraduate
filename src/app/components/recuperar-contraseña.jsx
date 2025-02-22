'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { urls } from './urls';

export default function RecuperarContraseña() {
  const [cedula, setCedula] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Realizar la petición al backend para verificar la cédula
      const response = await fetch(urls.recuperar_contrasena, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cedula }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.exists) {
          setMessage('Cédula válida. Se le enviará un correo con una nueva contraseña.');
        } else {
          setMessage('Cédula no registrada. Por favor, comuníquese con el administrador.');
        }
      } else {
        setMessage('Hubo un error al verificar la cédula. Intente nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error en la comunicación con el servidor. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

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
              <p className="text-xs">DACE</p>
            </div>
          </div>
        </div>
      </header>

      {/* Cuerpo principal de la página */}
      <main className="flex-grow mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 rounded-lg bg-gray-100 p-4 text-center">
          <h2 className="text-2xl font-bold text-[#004976]">Recuperar Contraseña</h2>
        </div>

        {/* Formulario de verificación de cédula */}
        <div className="max-w-md mx-auto">
          <Card className="border border-gray-200">
            <CardContent className="flex flex-col items-center p-6">
              <h3 className="mb-4 text-xl font-bold text-[#004976]">Ingrese su Cédula</h3>
              <form onSubmit={handleSubmit} className="w-full">
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="Ingrese su cédula"
                  className="w-full p-3 mb-4 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#004976]"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#e85d04] hover:bg-[#dc5303] text-white py-3 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verificando...' : 'Verificar Cédula'}
                </Button>
              </form>

              {/* Mensaje de resultado */}
              {message && (
                <p className={`mt-4 text-lg ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
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
