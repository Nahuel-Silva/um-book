import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PerfilComponent } from '../list/perfil.component';
import { PerfilDetailComponent } from '../detail/perfil-detail.component';
import { PerfilUpdateComponent } from '../update/perfil-update.component';
import { PerfilRoutingResolveService } from './perfil-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const perfilRoute: Routes = [
  {
    path: '',
    component: PerfilComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PerfilDetailComponent,
    resolve: {
      perfil: PerfilRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PerfilUpdateComponent,
    resolve: {
      perfil: PerfilRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PerfilUpdateComponent,
    resolve: {
      perfil: PerfilRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(perfilRoute)],
  exports: [RouterModule],
})
export class PerfilRoutingModule {}
