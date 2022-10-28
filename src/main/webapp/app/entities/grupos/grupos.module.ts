import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GruposComponent } from './list/grupos.component';
import { GruposDetailComponent } from './detail/grupos-detail.component';
import { GruposUpdateComponent } from './update/grupos-update.component';
import { GruposDeleteDialogComponent } from './delete/grupos-delete-dialog.component';
import { GruposRoutingModule } from './route/grupos-routing.module';

@NgModule({
  imports: [SharedModule, GruposRoutingModule],
  declarations: [GruposComponent, GruposDetailComponent, GruposUpdateComponent, GruposDeleteDialogComponent],
})
export class GruposModule {}
