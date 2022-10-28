import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPerfil, NewPerfil } from '../perfil.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPerfil for edit and NewPerfilFormGroupInput for create.
 */
type PerfilFormGroupInput = IPerfil | PartialWithRequiredKeyOf<NewPerfil>;

type PerfilFormDefaults = Pick<NewPerfil, 'id'>;

type PerfilFormGroupContent = {
  id: FormControl<IPerfil['id'] | NewPerfil['id']>;
  cantAlbumes: FormControl<IPerfil['cantAlbumes']>;
  cantSeguidores: FormControl<IPerfil['cantSeguidores']>;
  cantSeguidos: FormControl<IPerfil['cantSeguidos']>;
  descripcion: FormControl<IPerfil['descripcion']>;
};

export type PerfilFormGroup = FormGroup<PerfilFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PerfilFormService {
  createPerfilFormGroup(perfil: PerfilFormGroupInput = { id: null }): PerfilFormGroup {
    const perfilRawValue = {
      ...this.getFormDefaults(),
      ...perfil,
    };
    return new FormGroup<PerfilFormGroupContent>({
      id: new FormControl(
        { value: perfilRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      cantAlbumes: new FormControl(perfilRawValue.cantAlbumes),
      cantSeguidores: new FormControl(perfilRawValue.cantSeguidores),
      cantSeguidos: new FormControl(perfilRawValue.cantSeguidos),
      descripcion: new FormControl(perfilRawValue.descripcion),
    });
  }

  getPerfil(form: PerfilFormGroup): IPerfil | NewPerfil {
    return form.getRawValue() as IPerfil | NewPerfil;
  }

  resetForm(form: PerfilFormGroup, perfil: PerfilFormGroupInput): void {
    const perfilRawValue = { ...this.getFormDefaults(), ...perfil };
    form.reset(
      {
        ...perfilRawValue,
        id: { value: perfilRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PerfilFormDefaults {
    return {
      id: null,
    };
  }
}
