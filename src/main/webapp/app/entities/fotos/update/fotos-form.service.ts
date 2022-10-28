import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFotos, NewFotos } from '../fotos.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFotos for edit and NewFotosFormGroupInput for create.
 */
type FotosFormGroupInput = IFotos | PartialWithRequiredKeyOf<NewFotos>;

type FotosFormDefaults = Pick<NewFotos, 'id'>;

type FotosFormGroupContent = {
  id: FormControl<IFotos['id'] | NewFotos['id']>;
  descripcion: FormControl<IFotos['descripcion']>;
  album: FormControl<IFotos['album']>;
  usuario: FormControl<IFotos['usuario']>;
};

export type FotosFormGroup = FormGroup<FotosFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FotosFormService {
  createFotosFormGroup(fotos: FotosFormGroupInput = { id: null }): FotosFormGroup {
    const fotosRawValue = {
      ...this.getFormDefaults(),
      ...fotos,
    };
    return new FormGroup<FotosFormGroupContent>({
      id: new FormControl(
        { value: fotosRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      descripcion: new FormControl(fotosRawValue.descripcion),
      album: new FormControl(fotosRawValue.album),
      usuario: new FormControl(fotosRawValue.usuario),
    });
  }

  getFotos(form: FotosFormGroup): IFotos | NewFotos {
    return form.getRawValue() as IFotos | NewFotos;
  }

  resetForm(form: FotosFormGroup, fotos: FotosFormGroupInput): void {
    const fotosRawValue = { ...this.getFormDefaults(), ...fotos };
    form.reset(
      {
        ...fotosRawValue,
        id: { value: fotosRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FotosFormDefaults {
    return {
      id: null,
    };
  }
}
