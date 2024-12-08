'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function RegistroUsuario() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Registro de Usuario</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="nombre">Nombre:</label>
                <input
                  id="nombre"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="apellido">Apellido:</label>
                <input
                  id="apellido"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="cedula">Cedula:</label>
                <input
                  id="cedula"
                  name="cedula"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="on"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="correo">Correo:</label>
                <input
                  id="correo"
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="tipo-usuario">Tipo de Usuario:</label>
              <div className="relative">
                <select 
                  id="tipo-usuario"
                  className="w-full px-3 py-2 border rounded-md appearance-none bg-white"
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="estudiante">Estudiante</option>
                  <option value="profesor">Profesor</option>
                  <option value="admin">Administrador</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Contraseña:</label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">Confirme su contraseña:</label>
              <input
                id="confirm-password"
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Password requirements */}
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
              <p className="font-medium mb-2">La contraseña debe:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Considerar una longitud mínima de 8 caracteres.</li>
                <li>Al definir una, utilizar letras mayúsculas y minúsculas, números y caracteres especiales (%$#+-)</li>
                <li>No usar información personal o referente a nuestra persona (nombres, fechas, cuentas, empleo, formación, Etc.)</li>
              </ul>
            </div>

            <div className="flex justify-center"> {/* Centra los botones */}
  <CardContent>
    <div className="flex items-center space-x-8"> {/* Quita justify-between, usa space-x-8 */}
      <Button asChild>
        <Link href="/home">Atrás (Menú Principal)</Link>
      </Button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Registrarse
      </button>
    </div>
  </CardContent>
</div>

          </form>
        </div>
      </div>
    </div>
  )
}

