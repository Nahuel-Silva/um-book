import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ComentariosComponent } from '../list/comentarios.component';
import { ComentariosDetailComponent } from '../detail/comentarios-detail.component';
import { ComentariosUpdateComponent } from '../update/comentarios-update.component';
import { ComentariosRoutingResolveService } from './comentarios-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const comentariosRoute: Routes = [
  {
    path: '',
    component: ComentariosComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ComentariosDetailComponent,
    resolve: {
      comentarios: ComentariosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ComentariosUpdateComponent,
    resolve: {
      comentarios: ComentariosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ComentariosUpdateComponent,
    resolve: {
      comentarios: ComentariosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(comentariosRoute)],
  exports: [RouterModule],
})
export class ComentariosRoutingModule {}
