import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrupos } from '../grupos.model';
import { GruposService } from '../service/grupos.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './grupos-delete-dialog.component.html',
})
export class GruposDeleteDialogComponent {
  grupos?: IGrupos;

  constructor(protected gruposService: GruposService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gruposService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
