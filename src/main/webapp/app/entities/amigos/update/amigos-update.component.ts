import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AmigosFormService, AmigosFormGroup } from './amigos-form.service';
import { IAmigos } from '../amigos.model';
import { AmigosService } from '../service/amigos.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'jhi-amigos-update',
  templateUrl: './amigos-update.component.html',
})
export class AmigosUpdateComponent implements OnInit {
  isSaving = false;
  amigos: IAmigos | null = null;

  usuariosSharedCollection: IUsuario[] = [];

  editForm: AmigosFormGroup = this.amigosFormService.createAmigosFormGroup();

  constructor(
    protected amigosService: AmigosService,
    protected amigosFormService: AmigosFormService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ amigos }) => {
      this.amigos = amigos;
      if (amigos) {
        this.updateForm(amigos);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const amigos = this.amigosFormService.getAmigos(this.editForm);
    if (amigos.id !== null) {
      this.subscribeToSaveResponse(this.amigosService.update(amigos));
    } else {
      this.subscribeToSaveResponse(this.amigosService.create(amigos));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAmigos>>): void {
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

  protected updateForm(amigos: IAmigos): void {
    this.amigos = amigos;
    this.amigosFormService.resetForm(this.editForm, amigos);

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      amigos.usuario
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.amigos?.usuario)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
