"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Lock, EyeIcon, EyeClosedIcon } from 'lucide-react';

export default function LoginForm() {
  const [nationality, setNationality] = useState("V");
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString();
      setDateTime(formattedDateTime);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const postLogin = async () => {
    try {
      const fullCedula = `${nationality}-${cedula}`;
      const res = await fetch("http://localhost:8000/api/login_profesor/", { // Cambié la URL para reflejar el login del profesor
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: fullCedula,
          password: password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ha ocurrido un error durante la autenticación");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access);
      document.cookie = `token=${data.access}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      return data;
    } catch (error) {
      console.error(error);
      setError(error.message || "Ha ocurrido un error durante la autenticación");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await postLogin();
      router.push("/p-home-profe"); // Cambié la ruta de redirección al home del profesor
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#004976] border-b border-white/20 p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-white">
            <h1 className="text-xl"> <b> Núcleo de Anzoátegui </b> </h1>
            <h2 className="text-lg"> <b> Sistema de Control para PostGrados ECAT  </b> </h2>
          </div>
          <Image
            src="/Logo_UDO.svg.png"
            alt="Logo UDO"
            width={60}
            height={60}
            className="bg-white p-1 rounded-full"
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-md bg-[#81D4FE]">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#000000] mb-2">Autenticación de Usuario </h3>
              <p className="text-xl font-bold text-[#000000] mb-2"> Profesor</p> {/* Cambié "Administrador" por "Profesor" */}
              <div className="flex justify-center">
                <Lock className="w-16 h-16 text-yellow-500" />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-[#0F3272]">
                <Label htmlFor="cedula"><b>Usuario (Cédula):</b></Label>
                <div className="flex gap-1">
                  <select
                    id="nationality"
                    name="nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="border-[#004976] w-16 p-2 text-center"
                  >
                    <option value="V">V-</option>
                    <option value="E">E-</option>
                  </select>

                  <Input
                    id="cedula"
                    name="cedula"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="on"
                    required
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="border-[#004976] flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2 text-[#0F3272]">
                <Label htmlFor="password"><b>Contraseña:</b></Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#004976] flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#004976] p-2"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {!showPassword ?< EyeClosedIcon  />: <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  Aceptar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="px-8"
                  onClick={() => {
                    setCedula("");
                    setPassword("");
                    setNationality("V");
                    setError("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
