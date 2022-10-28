import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { NotificacionesFormService, NotificacionesFormGroup } from './notificaciones-form.service';
import { INotificaciones } from '../notificaciones.model';
import { NotificacionesService } from '../service/notificaciones.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'jhi-notificaciones-update',
  templateUrl: './notificaciones-update.component.html',
})
export class NotificacionesUpdateComponent implements OnInit {
  isSaving = false;
  notificaciones: INotificaciones | null = null;

  usuariosSharedCollection: IUsuario[] = [];

  editForm: NotificacionesFormGroup = this.notificacionesFormService.createNotificacionesFormGroup();

  constructor(
    protected notificacionesService: NotificacionesService,
    protected notificacionesFormService: NotificacionesFormService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notificaciones }) => {
      this.notificaciones = notificaciones;
      if (notificaciones) {
        this.updateForm(notificaciones);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notificaciones = this.notificacionesFormService.getNotificaciones(this.editForm);
    if (notificaciones.id !== null) {
      this.subscribeToSaveResponse(this.notificacionesService.update(notificaciones));
    } else {
      this.subscribeToSaveResponse(this.notificacionesService.create(notificaciones));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotificaciones>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(notificaciones: INotificaciones): void {
    this.notificaciones = notificaciones;
    this.notificacionesFormService.resetForm(this.editForm, notificaciones);

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      notificaciones.usuario
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.notificaciones?.usuario))
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
