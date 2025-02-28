import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, ClipboardList, BookOpen, User, FileDown, ChevronDown, Upload, Send } from "lucide-react"

export const menuItems = [
    { title: "Inicio", icon: FileText, href: "/estudiantes/e-home-estudiante" },
    /*{
      title: "Ver Pesum",
      icon: FileText,
      href: "/estudiantes/e-ver-pensum",
    },*/
    { title: "Ver Notas", icon: ClipboardList, href: "/estudiantes/e-ver-notas" },
    {
      title: "Control Pago",
      icon: BookOpen,
      href: "/estudiantes/e-control-pagos",
    },
    { title: "Mis Datos", icon: User, href: "/estudiantes/e-datos-estudiante" },
  ]

export const solicitudesItems = [
    { title: "Registro de Calificaciones", href: "/estudiantes/solicitudes/carta-culminacion" },
    { title: "Solvencia", href: "/estudiantes/solicitudes/solvencia" },
    { title: "Pensum", href: "/estudiantes/e-ver-pensum" },
    { title: "Constancia de Inscripción", href: "/estudiantes/solicitudes/constancia-inscripcion" },
    { title: "Elaboración de Expediente", href: "/estudiantes/solicitudes/carnet-estudiantil" },
  ]
