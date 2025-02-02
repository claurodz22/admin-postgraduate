import Link from "next/link"

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">No Autorizado</h1>
      <p className="text-xl mb-8">Lo siento, no tienes permiso para acceder a esta página.</p>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Volver al Inicio
      </Link>
    </div>
  )
}

