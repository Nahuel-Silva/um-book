import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NotificacionesComponent } from './list/notificaciones.component';
import { NotificacionesDetailComponent } from './detail/notificaciones-detail.component';
import { NotificacionesUpdateComponent } from './update/notificaciones-update.component';
import { NotificacionesDeleteDialogComponent } from './delete/notificaciones-delete-dialog.component';
import { NotificacionesRoutingModule } from './route/notificaciones-routing.module';

@NgModule({
  imports: [SharedModule, NotificacionesRoutingModule],
  declarations: [
    NotificacionesComponent,
    NotificacionesDetailComponent,
    NotificacionesUpdateComponent,
    NotificacionesDeleteDialogComponent,
  ],
})
export class NotificacionesModule {}
