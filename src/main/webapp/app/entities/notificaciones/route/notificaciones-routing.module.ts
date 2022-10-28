import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NotificacionesComponent } from '../list/notificaciones.component';
import { NotificacionesDetailComponent } from '../detail/notificaciones-detail.component';
import { NotificacionesUpdateComponent } from '../update/notificaciones-update.component';
import { NotificacionesRoutingResolveService } from './notificaciones-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const notificacionesRoute: Routes = [
  {
    path: '',
    component: NotificacionesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NotificacionesDetailComponent,
    resolve: {
      notificaciones: NotificacionesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NotificacionesUpdateComponent,
    resolve: {
      notificaciones: NotificacionesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NotificacionesUpdateComponent,
    resolve: {
      notificaciones: NotificacionesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(notificacionesRoute)],
  exports: [RouterModule],
})
export class NotificacionesRoutingModule {}
