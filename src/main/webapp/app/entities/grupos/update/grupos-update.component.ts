import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GruposFormService, GruposFormGroup } from './grupos-form.service';
import { IGrupos } from '../grupos.model';
import { GruposService } from '../service/grupos.service';
import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';

@Component({
  selector: 'jhi-grupos-update',
  templateUrl: './grupos-update.component.html',
})
export class GruposUpdateComponent implements OnInit {
  isSaving = false;
  grupos: IGrupos | null = null;

  albumsSharedCollection: IAlbum[] = [];

  editForm: GruposFormGroup = this.gruposFormService.createGruposFormGroup();

  constructor(
    protected gruposService: GruposService,
    protected gruposFormService: GruposFormService,
    protected albumService: AlbumService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAlbum = (o1: IAlbum | null, o2: IAlbum | null): boolean => this.albumService.compareAlbum(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grupos }) => {
      this.grupos = grupos;
      if (grupos) {
        this.updateForm(grupos);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grupos = this.gruposFormService.getGrupos(this.editForm);
    if (grupos.id !== null) {
      this.subscribeToSaveResponse(this.gruposService.update(grupos));
    } else {
      this.subscribeToSaveResponse(this.gruposService.create(grupos));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrupos>>): void {
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

  protected updateForm(grupos: IGrupos): void {
    this.grupos = grupos;
    this.gruposFormService.resetForm(this.editForm, grupos);

    this.albumsSharedCollection = this.albumService.addAlbumToCollectionIfMissing<IAlbum>(
      this.albumsSharedCollection,
      ...(grupos.albums ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.albumService
      .query()
      .pipe(map((res: HttpResponse<IAlbum[]>) => res.body ?? []))
      .pipe(map((albums: IAlbum[]) => this.albumService.addAlbumToCollectionIfMissing<IAlbum>(albums, ...(this.grupos?.albums ?? []))))
      .subscribe((albums: IAlbum[]) => (this.albumsSharedCollection = albums));
  }
}
