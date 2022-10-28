import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UsuarioFormService, UsuarioFormGroup } from './usuario-form.service';
import { IUsuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { IPerfil } from 'app/entities/perfil/perfil.model';
import { PerfilService } from 'app/entities/perfil/service/perfil.service';
import { IGrupos } from 'app/entities/grupos/grupos.model';
import { GruposService } from 'app/entities/grupos/service/grupos.service';
import { IAdmin } from 'app/entities/admin/admin.model';
import { AdminService } from 'app/entities/admin/service/admin.service';

@Component({
  selector: 'jhi-usuario-update',
  templateUrl: './usuario-update.component.html',
})
export class UsuarioUpdateComponent implements OnInit {
  isSaving = false;
  usuario: IUsuario | null = null;

  perfilsCollection: IPerfil[] = [];
  gruposSharedCollection: IGrupos[] = [];
  adminsSharedCollection: IAdmin[] = [];

  editForm: UsuarioFormGroup = this.usuarioFormService.createUsuarioFormGroup();

  constructor(
    protected usuarioService: UsuarioService,
    protected usuarioFormService: UsuarioFormService,
    protected perfilService: PerfilService,
    protected gruposService: GruposService,
    protected adminService: AdminService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePerfil = (o1: IPerfil | null, o2: IPerfil | null): boolean => this.perfilService.comparePerfil(o1, o2);

  compareGrupos = (o1: IGrupos | null, o2: IGrupos | null): boolean => this.gruposService.compareGrupos(o1, o2);

  compareAdmin = (o1: IAdmin | null, o2: IAdmin | null): boolean => this.adminService.compareAdmin(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuario }) => {
      this.usuario = usuario;
      if (usuario) {
        this.updateForm(usuario);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuario = this.usuarioFormService.getUsuario(this.editForm);
    if (usuario.id !== null) {
      this.subscribeToSaveResponse(this.usuarioService.update(usuario));
    } else {
      this.subscribeToSaveResponse(this.usuarioService.create(usuario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuario>>): void {
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

  protected updateForm(usuario: IUsuario): void {
    this.usuario = usuario;
    this.usuarioFormService.resetForm(this.editForm, usuario);

    this.perfilsCollection = this.perfilService.addPerfilToCollectionIfMissing<IPerfil>(this.perfilsCollection, usuario.perfil);
    this.gruposSharedCollection = this.gruposService.addGruposToCollectionIfMissing<IGrupos>(
      this.gruposSharedCollection,
      ...(usuario.grupos ?? [])
    );
    this.adminsSharedCollection = this.adminService.addAdminToCollectionIfMissing<IAdmin>(this.adminsSharedCollection, usuario.admin);
  }

  protected loadRelationshipsOptions(): void {
    this.perfilService
      .query({ filter: 'usuario-is-null' })
      .pipe(map((res: HttpResponse<IPerfil[]>) => res.body ?? []))
      .pipe(map((perfils: IPerfil[]) => this.perfilService.addPerfilToCollectionIfMissing<IPerfil>(perfils, this.usuario?.perfil)))
      .subscribe((perfils: IPerfil[]) => (this.perfilsCollection = perfils));

    this.gruposService
      .query()
      .pipe(map((res: HttpResponse<IGrupos[]>) => res.body ?? []))
      .pipe(map((grupos: IGrupos[]) => this.gruposService.addGruposToCollectionIfMissing<IGrupos>(grupos, ...(this.usuario?.grupos ?? []))))
      .subscribe((grupos: IGrupos[]) => (this.gruposSharedCollection = grupos));

    this.adminService
      .query()
      .pipe(map((res: HttpResponse<IAdmin[]>) => res.body ?? []))
      .pipe(map((admins: IAdmin[]) => this.adminService.addAdminToCollectionIfMissing<IAdmin>(admins, this.usuario?.admin)))
      .subscribe((admins: IAdmin[]) => (this.adminsSharedCollection = admins));
  }
}
