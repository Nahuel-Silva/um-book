import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PerfilComponent } from './list/perfil.component';
import { PerfilDetailComponent } from './detail/perfil-detail.component';
import { PerfilUpdateComponent } from './update/perfil-update.component';
import { PerfilDeleteDialogComponent } from './delete/perfil-delete-dialog.component';
import { PerfilRoutingModule } from './route/perfil-routing.module';

@NgModule({
  imports: [SharedModule, PerfilRoutingModule],
  declarations: [PerfilComponent, PerfilDetailComponent, PerfilUpdateComponent, PerfilDeleteDialogComponent],
})
export class PerfilModule {}
