import { Home, FileText, ClipboardList, BookOpen, User } from "lucide-react";

export const menuItems = [
    { title: "Inicio", icon: Home, href: "/profesor/p-home-profe" },
    { title: "Crear Planificación", icon: FileText, href: "/profesor/p-crear-planificacion" },
    { title: "Cargar Notas", icon: ClipboardList, href: "/profesor/p-cargar-notas" },
    { title: "Listar Materias Asignadas", icon: BookOpen, href: "/profesor/p-listar-materias" },
    { title: "Mis Datos", icon: User, href: "/profesor/p-datos-profe" },
];
