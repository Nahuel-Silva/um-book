import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFotos } from '../fotos.model';
import { FotosService } from '../service/fotos.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './fotos-delete-dialog.component.html',
})
export class FotosDeleteDialogComponent {
  fotos?: IFotos;

  constructor(protected fotosService: FotosService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fotosService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
