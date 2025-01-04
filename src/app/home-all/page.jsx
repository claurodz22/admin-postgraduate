/*
  Se hace el llamado a la vista que se desea obtener
  para mantener el orden, todas las vistas del admin 
  se almacenan en componentes > home-all

  El nombre "home-all" es el enlace para
  acceder a esta vista.

  Esta vista es la página principal de la aplicación
  web, dependiendo del tipo de usuario, el usuario
  escogerá el login que se adecue a su situación
*/

import HomeAll from '../components/home-all'

export default function Home() {
  return <HomeAll/>
}