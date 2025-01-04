/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > vistas-admin.

  El nombre "a-buscar-solicitudes-estudiantiles" es el enlace para
  acceder a esta vista (mientras se tenga el token de 
  acceso. Tipo de usuario = '1')
*/


import BuscarSolicitudesEstudiantiles from '../components/vistas-admin/buscar-solicitudes-estudiantiles'

export default function BSE() {
  return <BuscarSolicitudesEstudiantiles/>
}

/*
  El import *nombre* debe ser el mismo que 
  se retorna. BSE = Buscar Solicitudes Estudiantiles
*/