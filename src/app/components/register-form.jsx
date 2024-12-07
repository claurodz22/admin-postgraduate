'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'

export default function RegistroUsuario() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validatePassword = (value) => {
    if (value.length < 12) {
      setPasswordError('La contraseña debe tener al menos 12 caracteres')
    } else {
      setPasswordError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add your form submission logic here
    console.log('Form submitted')
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Registro de Usuario</CardTitle>
          <CardDescription>Por favor, complete todos los campos para registrarse.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula</Label>
                <Input id="cedula" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo</Label>
                <Input id="correo" type="email" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo-usuario">Tipo de Usuario</Label>
              <Select>
                <SelectTrigger id="tipo-usuario">
                  <SelectValue placeholder="Seleccione el tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuario Regular</SelectItem>
                  <SelectItem value="guest">Invitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre-usuario">Nombre de Usuario</Label>
              <Input id="nombre-usuario" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  validatePassword(e.target.value)
                }}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirme su Contraseña</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>

            {passwordError && (
              <div className="text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {passwordError}
              </div>
            )}

            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="font-semibold mb-2">La contraseña debe:</h3>
              <ul className="list-disc list-inside">
                <li>Tener al menos 12 caracteres</li>
              </ul>
            </div>

            <Button type="submit" className="w-full">Registrarse</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

