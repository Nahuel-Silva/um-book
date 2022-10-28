import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IComentarios, NewComentarios } from '../comentarios.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IComentarios for edit and NewComentariosFormGroupInput for create.
 */
type ComentariosFormGroupInput = IComentarios | PartialWithRequiredKeyOf<NewComentarios>;

type ComentariosFormDefaults = Pick<NewComentarios, 'id'>;

type ComentariosFormGroupContent = {
  id: FormControl<IComentarios['id'] | NewComentarios['id']>;
  descripcion: FormControl<IComentarios['descripcion']>;
  fotos: FormControl<IComentarios['fotos']>;
};

export type ComentariosFormGroup = FormGroup<ComentariosFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ComentariosFormService {
  createComentariosFormGroup(comentarios: ComentariosFormGroupInput = { id: null }): ComentariosFormGroup {
    const comentariosRawValue = {
      ...this.getFormDefaults(),
      ...comentarios,
    };
    return new FormGroup<ComentariosFormGroupContent>({
      id: new FormControl(
        { value: comentariosRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      descripcion: new FormControl(comentariosRawValue.descripcion),
      fotos: new FormControl(comentariosRawValue.fotos),
    });
  }

  getComentarios(form: ComentariosFormGroup): IComentarios | NewComentarios {
    return form.getRawValue() as IComentarios | NewComentarios;
  }

  resetForm(form: ComentariosFormGroup, comentarios: ComentariosFormGroupInput): void {
    const comentariosRawValue = { ...this.getFormDefaults(), ...comentarios };
    form.reset(
      {
        ...comentariosRawValue,
        id: { value: comentariosRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ComentariosFormDefaults {
    return {
      id: null,
    };
  }
}
