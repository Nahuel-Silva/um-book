import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AmigosComponent } from '../list/amigos.component';
import { AmigosDetailComponent } from '../detail/amigos-detail.component';
import { AmigosUpdateComponent } from '../update/amigos-update.component';
import { AmigosRoutingResolveService } from './amigos-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const amigosRoute: Routes = [
  {
    path: '',
    component: AmigosComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AmigosDetailComponent,
    resolve: {
      amigos: AmigosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AmigosUpdateComponent,
    resolve: {
      amigos: AmigosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AmigosUpdateComponent,
    resolve: {
      amigos: AmigosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(amigosRoute)],
  exports: [RouterModule],
})
export class AmigosRoutingModule {}
