'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function RegistroEstudiante() {
  const [estudiante, setEstudiante] = useState({
    cedula_estudiante: '',
    id_usuario: '',
    nombre_estudiante: '',
    carrera: '',
    anio_ingreso: '',
    estado: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setEstudiante(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar el estudiante en la base de datos
    console.log('Estudiante guardado:', estudiante)
    // Resetear el formulario después de guardar
    setEstudiante({
      cedula_estudiante: '',
      id_usuario: '',
      numero_estudiante: '',
      carrera: '',
      anio_ingreso: '',
      estado: ''
    })
    alert('Estudiante registrado con éxito!')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Registro de Estudiante</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cedula_estudiante" className="block text-sm font-medium text-gray-700 mb-1">
                  Cedula Estudiante
                </label>
                <input
                  id="cedula_estudiante"
                  name="cedula_estudiante"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="on"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
            </div>
            <div>
              <label htmlFor="nombre_estudiante" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Estudiante
              </label>
              <input
                type="text"
                id="nombre_estudiante"
                name="nombre_estudiante"
                value={estudiante.nombre_estudiante}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="carrera" className="block text-sm font-medium text-gray-700 mb-1">
                Carrera
              </label>
              <input
                type="text"
                id="carrera"
                name="carrera"
                value={estudiante.carrera}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="anio_ingreso" className="block text-sm font-medium text-gray-700 mb-1">
                Año de Ingreso
              </label>
              <input
                type="number"
                id="anio_ingreso"
                name="anio_ingreso"
                value={estudiante.anio_ingreso}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <div className="relative">
                <select
                  id="estado"
                  name="estado"
                  value={estudiante.estado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md appearance-none bg-white"
                  required
                >
                  <option value="">Seleccione un estado</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div className="flex justify-center"> {/* Centra los botones */}
              <CardContent>
                <div className="flex items-center space-x-8"> {/* Quita justify-between, usa space-x-8 */}
                  <Button asChild>
                    <Link href="/home">Atrás (Menú Principal)</Link>
                  </Button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Guardar Estudiante
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

