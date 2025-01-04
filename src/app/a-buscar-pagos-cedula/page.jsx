/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-buscar-pagos-cedula" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import BuscarPagosCedula from '../components/vistas-admin/buscar-pagos-cedula'

export default function BPC() {
  return <BuscarPagosCedula/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. BPC = Buscar Pagos Cedula
*/