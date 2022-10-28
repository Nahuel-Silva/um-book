import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAlbum, NewAlbum } from '../album.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAlbum for edit and NewAlbumFormGroupInput for create.
 */
type AlbumFormGroupInput = IAlbum | PartialWithRequiredKeyOf<NewAlbum>;

type AlbumFormDefaults = Pick<NewAlbum, 'id' | 'grupos'>;

type AlbumFormGroupContent = {
  id: FormControl<IAlbum['id'] | NewAlbum['id']>;
  nombre: FormControl<IAlbum['nombre']>;
  descripcion: FormControl<IAlbum['descripcion']>;
  cantFotos: FormControl<IAlbum['cantFotos']>;
  perfil: FormControl<IAlbum['perfil']>;
  usuario: FormControl<IAlbum['usuario']>;
  grupos: FormControl<IAlbum['grupos']>;
};

export type AlbumFormGroup = FormGroup<AlbumFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AlbumFormService {
  createAlbumFormGroup(album: AlbumFormGroupInput = { id: null }): AlbumFormGroup {
    const albumRawValue = {
      ...this.getFormDefaults(),
      ...album,
    };
    return new FormGroup<AlbumFormGroupContent>({
      id: new FormControl(
        { value: albumRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nombre: new FormControl(albumRawValue.nombre),
      descripcion: new FormControl(albumRawValue.descripcion),
      cantFotos: new FormControl(albumRawValue.cantFotos),
      perfil: new FormControl(albumRawValue.perfil),
      usuario: new FormControl(albumRawValue.usuario),
      grupos: new FormControl(albumRawValue.grupos ?? []),
    });
  }

  getAlbum(form: AlbumFormGroup): IAlbum | NewAlbum {
    return form.getRawValue() as IAlbum | NewAlbum;
  }

  resetForm(form: AlbumFormGroup, album: AlbumFormGroupInput): void {
    const albumRawValue = { ...this.getFormDefaults(), ...album };
    form.reset(
      {
        ...albumRawValue,
        id: { value: albumRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AlbumFormDefaults {
    return {
      id: null,
      grupos: [],
    };
  }
}
