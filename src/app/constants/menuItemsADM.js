import { Home, UserPlus, GraduationCap, ClipboardList, CreditCard, FileText, BookOpen, Users } from "lucide-react"

export const menuItems = [
  { title: "Inicio", icon: Home, href: "/administrador/a-home-admin" },
  { title: "Registro / Actualización de Usuarios ", icon: UserPlus, href: "/administrador/a-register-user" },
  { title: "Listar / Eliminar Usuarios", icon: Users, href: "/administrador/a-list-eliminate" },
  { title: "Registro / Actualización de Estudiantes ", icon: GraduationCap, href: "/administrador/a-register-student" },
  { title: "Control de Notas", icon: ClipboardList, href: "/administrador/a-control-notas" },
  { title: "Control de Pagos", icon: CreditCard, href: "/administrador/a-control-pagos" },
  { title: "Solicitudes Estudiantiles", icon: FileText, href: "/administrador/a-solicitudes-estudiantiles" },
  { title: "Asignar Materia", icon: BookOpen, href: "/administrador/a-asignar-materia" },
]

