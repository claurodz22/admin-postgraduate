/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-buscar-pagos-cedula" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import AsignarMaterias from '../components/vistas-admin/asignar-materias'

export default function AM() {
  return <AsignarMaterias/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. BPC = Buscar Pagos Cedula
*/