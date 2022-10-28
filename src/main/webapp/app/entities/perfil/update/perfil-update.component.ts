import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PerfilFormService, PerfilFormGroup } from './perfil-form.service';
import { IPerfil } from '../perfil.model';
import { PerfilService } from '../service/perfil.service';

@Component({
  selector: 'jhi-perfil-update',
  templateUrl: './perfil-update.component.html',
})
export class PerfilUpdateComponent implements OnInit {
  isSaving = false;
  perfil: IPerfil | null = null;

  editForm: PerfilFormGroup = this.perfilFormService.createPerfilFormGroup();

  constructor(
    protected perfilService: PerfilService,
    protected perfilFormService: PerfilFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ perfil }) => {
      this.perfil = perfil;
      if (perfil) {
        this.updateForm(perfil);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const perfil = this.perfilFormService.getPerfil(this.editForm);
    if (perfil.id !== null) {
      this.subscribeToSaveResponse(this.perfilService.update(perfil));
    } else {
      this.subscribeToSaveResponse(this.perfilService.create(perfil));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPerfil>>): void {
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

  protected updateForm(perfil: IPerfil): void {
    this.perfil = perfil;
    this.perfilFormService.resetForm(this.editForm, perfil);
  }
}
