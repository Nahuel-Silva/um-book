import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'usuario',
        data: { pageTitle: 'umbookApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'notificaciones',
        data: { pageTitle: 'umbookApp.notificaciones.home.title' },
        loadChildren: () => import('./notificaciones/notificaciones.module').then(m => m.NotificacionesModule),
      },
      {
        path: 'grupos',
        data: { pageTitle: 'umbookApp.grupos.home.title' },
        loadChildren: () => import('./grupos/grupos.module').then(m => m.GruposModule),
      },
      {
        path: 'perfil',
        data: { pageTitle: 'umbookApp.perfil.home.title' },
        loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule),
      },
      {
        path: 'album',
        data: { pageTitle: 'umbookApp.album.home.title' },
        loadChildren: () => import('./album/album.module').then(m => m.AlbumModule),
      },
      {
        path: 'fotos',
        data: { pageTitle: 'umbookApp.fotos.home.title' },
        loadChildren: () => import('./fotos/fotos.module').then(m => m.FotosModule),
      },
      {
        path: 'comentarios',
        data: { pageTitle: 'umbookApp.comentarios.home.title' },
        loadChildren: () => import('./comentarios/comentarios.module').then(m => m.ComentariosModule),
      },
      {
        path: 'amigos',
        data: { pageTitle: 'umbookApp.amigos.home.title' },
        loadChildren: () => import('./amigos/amigos.module').then(m => m.AmigosModule),
      },
      {
        path: 'admin',
        data: { pageTitle: 'umbookApp.admin.home.title' },
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
