/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-home-admin" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import HomeAdmin from '../components/vistas-admin/main-page-admin'

export default function HA() {
  return <HomeAdmin/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. HA = Home Admin
*/