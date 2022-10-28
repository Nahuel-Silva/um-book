import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { INotificaciones, NewNotificaciones } from '../notificaciones.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INotificaciones for edit and NewNotificacionesFormGroupInput for create.
 */
type NotificacionesFormGroupInput = INotificaciones | PartialWithRequiredKeyOf<NewNotificaciones>;

type NotificacionesFormDefaults = Pick<NewNotificaciones, 'id'>;

type NotificacionesFormGroupContent = {
  id: FormControl<INotificaciones['id'] | NewNotificaciones['id']>;
  tipoNotificacion: FormControl<INotificaciones['tipoNotificacion']>;
  usuario: FormControl<INotificaciones['usuario']>;
};

export type NotificacionesFormGroup = FormGroup<NotificacionesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NotificacionesFormService {
  createNotificacionesFormGroup(notificaciones: NotificacionesFormGroupInput = { id: null }): NotificacionesFormGroup {
    const notificacionesRawValue = {
      ...this.getFormDefaults(),
      ...notificaciones,
    };
    return new FormGroup<NotificacionesFormGroupContent>({
      id: new FormControl(
        { value: notificacionesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      tipoNotificacion: new FormControl(notificacionesRawValue.tipoNotificacion),
      usuario: new FormControl(notificacionesRawValue.usuario),
    });
  }

  getNotificaciones(form: NotificacionesFormGroup): INotificaciones | NewNotificaciones {
    return form.getRawValue() as INotificaciones | NewNotificaciones;
  }

  resetForm(form: NotificacionesFormGroup, notificaciones: NotificacionesFormGroupInput): void {
    const notificacionesRawValue = { ...this.getFormDefaults(), ...notificaciones };
    form.reset(
      {
        ...notificacionesRawValue,
        id: { value: notificacionesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): NotificacionesFormDefaults {
    return {
      id: null,
    };
  }
}
