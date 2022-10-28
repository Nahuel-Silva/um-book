import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAmigos } from '../amigos.model';
import { AmigosService } from '../service/amigos.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './amigos-delete-dialog.component.html',
})
export class AmigosDeleteDialogComponent {
  amigos?: IAmigos;

  constructor(protected amigosService: AmigosService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.amigosService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
