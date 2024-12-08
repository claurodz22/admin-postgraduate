'use client'

import React, { useState, useEffect } from 'react'

export default function TablaPagos() {
  const [pagos, setPagos] = useState([])

  useEffect(() => {
    // Simular la carga de datos
    // En una aplicación real, aquí harías una llamada a una API
    const cargarPagos = async () => {
      // Datos de ejemplo
      const datosPagos = [
        { id: '1', cedula: '27943668', fechaPago: '2024-12-01', montoPago: 100.00, status: 'Verificado' },
        { id: '2', cedula: '28686549', fechaPago: '2024-11-22', montoPago: 150.50, status: 'Pendiente' },
        { id: '3', cedula: '28666649', fechaPago: '2024-12-03', montoPago: 200.75, status: 'Verificado' },
      ]
      setPagos(datosPagos)
    }

    cargarPagos()
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto de Pago</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pagos.map((pago) => (
            <tr key={pago.id}>
              <td className="px-6 py-4 whitespace-nowrap">{pago.cedula}</td>
              <td className="px-6 py-4 whitespace-nowrap">{pago.fechaPago}</td>
              <td className="px-6 py-4 whitespace-nowrap">Bs {pago.montoPago.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  pago.status === 'Verificado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {pago.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagos.length === 0 && (
        <p className="text-center py-4 text-gray-500">No hay pagos para mostrar.</p>
      )}
    </div>
  )
}

