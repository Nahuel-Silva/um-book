import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IComentarios } from '../comentarios.model';
import { ComentariosService } from '../service/comentarios.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './comentarios-delete-dialog.component.html',
})
export class ComentariosDeleteDialogComponent {
  comentarios?: IComentarios;

  constructor(protected comentariosService: ComentariosService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.comentariosService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
