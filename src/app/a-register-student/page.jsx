/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-register-student" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import RegistroEstudiante from '../components/vistas-admin/register-student'

export default function RE() {
  return <RegistroEstudiante/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. RE = Registro Estudiante
*/