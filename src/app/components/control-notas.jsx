'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from 'next/link'


const NotasEstudiantes = ({ estudiantes }) => (
  <ul className="list-disc pl-5">
    {estudiantes.map((estudiante, index) => (
      <li key={index} className="text-sm">
        {estudiante.nombre}: <span className="font-semibold">{estudiante.nota.toFixed(1)}</span>
      </li>
    ))}
  </ul>
)

export default function ControlNotas() {
  const [datos, setDatos] = useState([])

  useEffect(() => {
    // Simulación de carga de datos
    const datosMock = [
      {
        cedulaProfesor: '12345678',
        nombreProfesor: 'Juan Martínez',
        codigoMateria: 'MAT101',
        nombreMateria: 'Cálculo I',
        corte: '2023-1',
        estudiantes: [
          { nombre: 'Ana López', nota: 4.5 },
          { nombre: 'Carlos Pérez', nota: 4.2 },
          { nombre: 'María Rodríguez', nota: 3.8 },
        ],
      },
      {
        cedulaProfesor: '87654321',
        nombreProfesor: 'Laura Gómez',
        codigoMateria: 'FIS202',
        nombreMateria: 'Física II',
        corte: '2023-1',
        estudiantes: [
          { nombre: 'Pedro Sánchez', nota: 4.0 },
          { nombre: 'Sofía Martínez', nota: 3.5 },
          { nombre: 'Diego González', nota: 4.8 },
        ],
      },
    ]
    setDatos(datosMock)
  }, [])

  return (
    <><div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Control de Notas</h1>
          <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gray-200">
                      <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cédula Profesor</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre Profesor</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Código Materia</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre Materia</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Corte/Periodo</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estudiantes y Notas</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {datos.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.cedulaProfesor}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.nombreProfesor}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.codigoMateria}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.nombreMateria}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.corte}</td>
                              <td className="px-4 py-4">
                                  <NotasEstudiantes estudiantes={item.estudiantes} />
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          {datos.length === 0 && (
              <p className="text-center py-4 text-gray-500">No hay datos para mostrar.</p>
          )}
      </div><div className="flex items-center space-x-8">
              <Button asChild>
                  <Link href="/home">Atrás (Menú Principal)</Link>
              </Button>
          </div></>
  )
}

