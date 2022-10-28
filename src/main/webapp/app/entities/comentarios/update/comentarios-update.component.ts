import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ComentariosFormService, ComentariosFormGroup } from './comentarios-form.service';
import { IComentarios } from '../comentarios.model';
import { ComentariosService } from '../service/comentarios.service';
import { IFotos } from 'app/entities/fotos/fotos.model';
import { FotosService } from 'app/entities/fotos/service/fotos.service';

@Component({
  selector: 'jhi-comentarios-update',
  templateUrl: './comentarios-update.component.html',
})
export class ComentariosUpdateComponent implements OnInit {
  isSaving = false;
  comentarios: IComentarios | null = null;

  fotosSharedCollection: IFotos[] = [];

  editForm: ComentariosFormGroup = this.comentariosFormService.createComentariosFormGroup();

  constructor(
    protected comentariosService: ComentariosService,
    protected comentariosFormService: ComentariosFormService,
    protected fotosService: FotosService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareFotos = (o1: IFotos | null, o2: IFotos | null): boolean => this.fotosService.compareFotos(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comentarios }) => {
      this.comentarios = comentarios;
      if (comentarios) {
        this.updateForm(comentarios);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comentarios = this.comentariosFormService.getComentarios(this.editForm);
    if (comentarios.id !== null) {
      this.subscribeToSaveResponse(this.comentariosService.update(comentarios));
    } else {
      this.subscribeToSaveResponse(this.comentariosService.create(comentarios));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComentarios>>): void {
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

  protected updateForm(comentarios: IComentarios): void {
    this.comentarios = comentarios;
    this.comentariosFormService.resetForm(this.editForm, comentarios);

    this.fotosSharedCollection = this.fotosService.addFotosToCollectionIfMissing<IFotos>(this.fotosSharedCollection, comentarios.fotos);
  }

  protected loadRelationshipsOptions(): void {
    this.fotosService
      .query()
      .pipe(map((res: HttpResponse<IFotos[]>) => res.body ?? []))
      .pipe(map((fotos: IFotos[]) => this.fotosService.addFotosToCollectionIfMissing<IFotos>(fotos, this.comentarios?.fotos)))
      .subscribe((fotos: IFotos[]) => (this.fotosSharedCollection = fotos));
  }
}
