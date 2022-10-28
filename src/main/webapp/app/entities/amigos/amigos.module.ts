import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AmigosComponent } from './list/amigos.component';
import { AmigosDetailComponent } from './detail/amigos-detail.component';
import { AmigosUpdateComponent } from './update/amigos-update.component';
import { AmigosDeleteDialogComponent } from './delete/amigos-delete-dialog.component';
import { AmigosRoutingModule } from './route/amigos-routing.module';

@NgModule({
  imports: [SharedModule, AmigosRoutingModule],
  declarations: [AmigosComponent, AmigosDetailComponent, AmigosUpdateComponent, AmigosDeleteDialogComponent],
})
export class AmigosModule {}
