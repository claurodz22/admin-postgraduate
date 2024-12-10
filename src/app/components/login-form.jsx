"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../utils/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateTime, setDateTime] = useState(""); // Estado para la fecha y hora
  const router = useRouter();
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString(); // Formato de fecha y hora según la configuración regional del navegador. Puedes personalizar el formato si necesitas algo específico.
      setDateTime(formattedDateTime);
    };

    updateDateTime(); // Actualiza al montar el componente
    const intervalId = setInterval(updateDateTime, 1000); // Actualiza cada segundo

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
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
    // Aquí iría la lógica de inicio de sesión
    console.log("Inicio de sesión con:", email, password);
    try {
      await login(email,password);
      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {" "}
        {/* Este div ya tiene w-full */}
        <div className="bg-blue-500 text-white p-4 mb-4 w-full">
          {" "}
          {/* Franja azul a todo ancho */}
          <p className="text-center">
            Universidad de Oriente, Núcleo Anzoátegui - {dateTime}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/Logo_UDO.svg.png"
            alt="Logo_UDO"
            width={150}
            height={150}
            className="mb-4"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Control de Postgrado <br /> Ciencias Administrativas
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="cedula" className="sr-only">
                Cedula
              </Label>
              <Input
                id="cedula"
                name="email"
                type="number"
                min={0}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="on"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Cedula"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <CardContent>
              <div className="flex justify-center">
                {" "}
                {/* Centra el botón horizontalmente */}
                <Button
                  type="submit"
                  className="relative flex w-[250px] justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {/* <Link href="/home">Iniciar sesión</Link> */}
                  Iniciar sesión
                </Button>
              </div>
            </CardContent>
          </div>
        </form>
      </div>
    </div>
  );
}
