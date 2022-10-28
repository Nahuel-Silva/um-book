import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FotosComponent } from './list/fotos.component';
import { FotosDetailComponent } from './detail/fotos-detail.component';
import { FotosUpdateComponent } from './update/fotos-update.component';
import { FotosDeleteDialogComponent } from './delete/fotos-delete-dialog.component';
import { FotosRoutingModule } from './route/fotos-routing.module';

@NgModule({
  imports: [SharedModule, FotosRoutingModule],
  declarations: [FotosComponent, FotosDetailComponent, FotosUpdateComponent, FotosDeleteDialogComponent],
})
export class FotosModule {}
