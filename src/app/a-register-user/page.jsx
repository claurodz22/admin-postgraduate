/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-register-user" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import RegistroUsuario from '../components/vistas-admin/register-form'

export default function RU() {
  return <RegistroUsuario/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. RU = Registro Usuario
*/