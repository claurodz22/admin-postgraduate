"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { login } from "../utils/auth";
import { Lock } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateTime, setDateTime] = useState("");
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
      const res = await fetch("http://localhost:8000/api/token/", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!res.ok) Promise.reject(res);

      const data = await res.json();
      console.log({ data });
      localStorage.setItem("token", data.access);
    } catch (error) {
      alert(error?.message || "A ocurrido un error");
      throw new Error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/home-admin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-md bg-[#81D4FE]">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#000000] mb-2">Autenticación de Usuario </h3>
              <p className="text-xl font-bold text-[#000000] mb-2"> Administrador</p>
              <div className="flex justify-center">
                <Lock className="w-16 h-16 text-yellow-500" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-[#0F3272]">
                <Label htmlFor="cedula"><b>Usuario:</b></Label>
                <Input
                  id="cedula"
                  name="email"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="on"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#004976]"
                />
              </div>

              <div className="space-y-2 text-[#0F3272]">
                <Label htmlFor="password"><b>Contraseña:</b></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#004976]"
                />
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
                    setEmail("");
                    setPassword("");
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

