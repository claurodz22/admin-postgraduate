/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-reporte-solicitudes-estudiantiles" es la ruta para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/

import ReporteNotasEstudiantiles from '../components/vistas-admin/reporte-notas-estudiantes'

export default function RSE() {
  return <ReporteNotasEstudiantiles/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. RSE = Reporte Solicitudes Estudiantiles 
*/