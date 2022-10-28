import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGrupos, NewGrupos } from '../grupos.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGrupos for edit and NewGruposFormGroupInput for create.
 */
type GruposFormGroupInput = IGrupos | PartialWithRequiredKeyOf<NewGrupos>;

type GruposFormDefaults = Pick<NewGrupos, 'id' | 'albums' | 'usuarios'>;

type GruposFormGroupContent = {
  id: FormControl<IGrupos['id'] | NewGrupos['id']>;
  nombre: FormControl<IGrupos['nombre']>;
  cantPersonas: FormControl<IGrupos['cantPersonas']>;
  albums: FormControl<IGrupos['albums']>;
  usuarios: FormControl<IGrupos['usuarios']>;
};

export type GruposFormGroup = FormGroup<GruposFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GruposFormService {
  createGruposFormGroup(grupos: GruposFormGroupInput = { id: null }): GruposFormGroup {
    const gruposRawValue = {
      ...this.getFormDefaults(),
      ...grupos,
    };
    return new FormGroup<GruposFormGroupContent>({
      id: new FormControl(
        { value: gruposRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nombre: new FormControl(gruposRawValue.nombre),
      cantPersonas: new FormControl(gruposRawValue.cantPersonas),
      albums: new FormControl(gruposRawValue.albums ?? []),
      usuarios: new FormControl(gruposRawValue.usuarios ?? []),
    });
  }

  getGrupos(form: GruposFormGroup): IGrupos | NewGrupos {
    return form.getRawValue() as IGrupos | NewGrupos;
  }

  resetForm(form: GruposFormGroup, grupos: GruposFormGroupInput): void {
    const gruposRawValue = { ...this.getFormDefaults(), ...grupos };
    form.reset(
      {
        ...gruposRawValue,
        id: { value: gruposRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GruposFormDefaults {
    return {
      id: null,
      albums: [],
      usuarios: [],
    };
  }
}
