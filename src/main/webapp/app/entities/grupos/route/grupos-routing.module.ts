import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GruposComponent } from '../list/grupos.component';
import { GruposDetailComponent } from '../detail/grupos-detail.component';
import { GruposUpdateComponent } from '../update/grupos-update.component';
import { GruposRoutingResolveService } from './grupos-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const gruposRoute: Routes = [
  {
    path: '',
    component: GruposComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GruposDetailComponent,
    resolve: {
      grupos: GruposRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GruposUpdateComponent,
    resolve: {
      grupos: GruposRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GruposUpdateComponent,
    resolve: {
      grupos: GruposRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(gruposRoute)],
  exports: [RouterModule],
})
export class GruposRoutingModule {}
