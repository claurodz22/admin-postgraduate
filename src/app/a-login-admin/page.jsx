/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-login-admin" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import LoginAdmin from '../components/vistas-admin/login-form'

export default function LA() {
  return <LoginAdmin/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. LA = Login Admin
*/