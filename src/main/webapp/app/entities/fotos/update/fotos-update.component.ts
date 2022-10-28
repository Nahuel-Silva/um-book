import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FotosFormService, FotosFormGroup } from './fotos-form.service';
import { IFotos } from '../fotos.model';
import { FotosService } from '../service/fotos.service';
import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'jhi-fotos-update',
  templateUrl: './fotos-update.component.html',
})
export class FotosUpdateComponent implements OnInit {
  isSaving = false;
  fotos: IFotos | null = null;

  albumsSharedCollection: IAlbum[] = [];
  usuariosSharedCollection: IUsuario[] = [];

  editForm: FotosFormGroup = this.fotosFormService.createFotosFormGroup();

  constructor(
    protected fotosService: FotosService,
    protected fotosFormService: FotosFormService,
    protected albumService: AlbumService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAlbum = (o1: IAlbum | null, o2: IAlbum | null): boolean => this.albumService.compareAlbum(o1, o2);

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fotos }) => {
      this.fotos = fotos;
      if (fotos) {
        this.updateForm(fotos);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fotos = this.fotosFormService.getFotos(this.editForm);
    if (fotos.id !== null) {
      this.subscribeToSaveResponse(this.fotosService.update(fotos));
    } else {
      this.subscribeToSaveResponse(this.fotosService.create(fotos));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFotos>>): void {
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

  protected updateForm(fotos: IFotos): void {
    this.fotos = fotos;
    this.fotosFormService.resetForm(this.editForm, fotos);

    this.albumsSharedCollection = this.albumService.addAlbumToCollectionIfMissing<IAlbum>(this.albumsSharedCollection, fotos.album);
    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      fotos.usuario
    );
  }

  protected loadRelationshipsOptions(): void {
    this.albumService
      .query()
      .pipe(map((res: HttpResponse<IAlbum[]>) => res.body ?? []))
      .pipe(map((albums: IAlbum[]) => this.albumService.addAlbumToCollectionIfMissing<IAlbum>(albums, this.fotos?.album)))
      .subscribe((albums: IAlbum[]) => (this.albumsSharedCollection = albums));

    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.fotos?.usuario)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
