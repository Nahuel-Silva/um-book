import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ComentariosComponent } from './list/comentarios.component';
import { ComentariosDetailComponent } from './detail/comentarios-detail.component';
import { ComentariosUpdateComponent } from './update/comentarios-update.component';
import { ComentariosDeleteDialogComponent } from './delete/comentarios-delete-dialog.component';
import { ComentariosRoutingModule } from './route/comentarios-routing.module';

@NgModule({
  imports: [SharedModule, ComentariosRoutingModule],
  declarations: [ComentariosComponent, ComentariosDetailComponent, ComentariosUpdateComponent, ComentariosDeleteDialogComponent],
})
export class ComentariosModule {}
