/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-crear-cohorte" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import CrearCohorte from '../components/vistas-admin/creacion-cohorte'

export default function CH() {
  return <CrearCohorte/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. CH = Crear Cohorte
*/