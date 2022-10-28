import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPerfil } from '../perfil.model';
import { PerfilService } from '../service/perfil.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './perfil-delete-dialog.component.html',
})
export class PerfilDeleteDialogComponent {
  perfil?: IPerfil;

  constructor(protected perfilService: PerfilService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.perfilService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
