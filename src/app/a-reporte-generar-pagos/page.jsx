/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-reporte-generar-pagos" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import ReportePagos from '../components/vistas-admin/reporte-pagos'

export default function RP() {
  return <ReportePagos/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. RP = Reporte Pagos
*/