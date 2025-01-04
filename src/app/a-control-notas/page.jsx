/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-control-notas" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import ControlNotas from '../components/vistas-admin/control-notas'

export default function CN() {
  return <ControlNotas/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. CN = control Notas
*/