import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAmigos, NewAmigos } from '../amigos.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAmigos for edit and NewAmigosFormGroupInput for create.
 */
type AmigosFormGroupInput = IAmigos | PartialWithRequiredKeyOf<NewAmigos>;

type AmigosFormDefaults = Pick<NewAmigos, 'id'>;

type AmigosFormGroupContent = {
  id: FormControl<IAmigos['id'] | NewAmigos['id']>;
  cantidad: FormControl<IAmigos['cantidad']>;
  amigosComun: FormControl<IAmigos['amigosComun']>;
  usuario: FormControl<IAmigos['usuario']>;
};

export type AmigosFormGroup = FormGroup<AmigosFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AmigosFormService {
  createAmigosFormGroup(amigos: AmigosFormGroupInput = { id: null }): AmigosFormGroup {
    const amigosRawValue = {
      ...this.getFormDefaults(),
      ...amigos,
    };
    return new FormGroup<AmigosFormGroupContent>({
      id: new FormControl(
        { value: amigosRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      cantidad: new FormControl(amigosRawValue.cantidad),
      amigosComun: new FormControl(amigosRawValue.amigosComun),
      usuario: new FormControl(amigosRawValue.usuario),
    });
  }

  getAmigos(form: AmigosFormGroup): IAmigos | NewAmigos {
    return form.getRawValue() as IAmigos | NewAmigos;
  }

  resetForm(form: AmigosFormGroup, amigos: AmigosFormGroupInput): void {
    const amigosRawValue = { ...this.getFormDefaults(), ...amigos };
    form.reset(
      {
        ...amigosRawValue,
        id: { value: amigosRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AmigosFormDefaults {
    return {
      id: null,
    };
  }
}
