import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FotosComponent } from '../list/fotos.component';
import { FotosDetailComponent } from '../detail/fotos-detail.component';
import { FotosUpdateComponent } from '../update/fotos-update.component';
import { FotosRoutingResolveService } from './fotos-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const fotosRoute: Routes = [
  {
    path: '',
    component: FotosComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FotosDetailComponent,
    resolve: {
      fotos: FotosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FotosUpdateComponent,
    resolve: {
      fotos: FotosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FotosUpdateComponent,
    resolve: {
      fotos: FotosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fotosRoute)],
  exports: [RouterModule],
})
export class FotosRoutingModule {}
