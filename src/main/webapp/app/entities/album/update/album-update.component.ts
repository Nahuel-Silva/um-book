import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AlbumFormService, AlbumFormGroup } from './album-form.service';
import { IAlbum } from '../album.model';
import { AlbumService } from '../service/album.service';
import { IPerfil } from 'app/entities/perfil/perfil.model';
import { PerfilService } from 'app/entities/perfil/service/perfil.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'jhi-album-update',
  templateUrl: './album-update.component.html',
})
export class AlbumUpdateComponent implements OnInit {
  isSaving = false;
  album: IAlbum | null = null;

  perfilsSharedCollection: IPerfil[] = [];
  usuariosSharedCollection: IUsuario[] = [];

  editForm: AlbumFormGroup = this.albumFormService.createAlbumFormGroup();

  constructor(
    protected albumService: AlbumService,
    protected albumFormService: AlbumFormService,
    protected perfilService: PerfilService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePerfil = (o1: IPerfil | null, o2: IPerfil | null): boolean => this.perfilService.comparePerfil(o1, o2);

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ album }) => {
      this.album = album;
      if (album) {
        this.updateForm(album);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const album = this.albumFormService.getAlbum(this.editForm);
    if (album.id !== null) {
      this.subscribeToSaveResponse(this.albumService.update(album));
    } else {
      this.subscribeToSaveResponse(this.albumService.create(album));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlbum>>): void {
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

  protected updateForm(album: IAlbum): void {
    this.album = album;
    this.albumFormService.resetForm(this.editForm, album);

    this.perfilsSharedCollection = this.perfilService.addPerfilToCollectionIfMissing<IPerfil>(this.perfilsSharedCollection, album.perfil);
    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      album.usuario
    );
  }

  protected loadRelationshipsOptions(): void {
    this.perfilService
      .query()
      .pipe(map((res: HttpResponse<IPerfil[]>) => res.body ?? []))
      .pipe(map((perfils: IPerfil[]) => this.perfilService.addPerfilToCollectionIfMissing<IPerfil>(perfils, this.album?.perfil)))
      .subscribe((perfils: IPerfil[]) => (this.perfilsSharedCollection = perfils));

    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.album?.usuario)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
