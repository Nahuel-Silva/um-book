import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUsuario, NewUsuario } from '../usuario.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUsuario for edit and NewUsuarioFormGroupInput for create.
 */
type UsuarioFormGroupInput = IUsuario | PartialWithRequiredKeyOf<NewUsuario>;

type UsuarioFormDefaults = Pick<NewUsuario, 'id' | 'grupos'>;

type UsuarioFormGroupContent = {
  id: FormControl<IUsuario['id'] | NewUsuario['id']>;
  nombre: FormControl<IUsuario['nombre']>;
  apellido: FormControl<IUsuario['apellido']>;
  mail: FormControl<IUsuario['mail']>;
  password: FormControl<IUsuario['password']>;
  tipoUsuario: FormControl<IUsuario['tipoUsuario']>;
  perfil: FormControl<IUsuario['perfil']>;
  grupos: FormControl<IUsuario['grupos']>;
  admin: FormControl<IUsuario['admin']>;
};

export type UsuarioFormGroup = FormGroup<UsuarioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UsuarioFormService {
  createUsuarioFormGroup(usuario: UsuarioFormGroupInput = { id: null }): UsuarioFormGroup {
    const usuarioRawValue = {
      ...this.getFormDefaults(),
      ...usuario,
    };
    return new FormGroup<UsuarioFormGroupContent>({
      id: new FormControl(
        { value: usuarioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nombre: new FormControl(usuarioRawValue.nombre),
      apellido: new FormControl(usuarioRawValue.apellido),
      mail: new FormControl(usuarioRawValue.mail),
      password: new FormControl(usuarioRawValue.password),
      tipoUsuario: new FormControl(usuarioRawValue.tipoUsuario),
      perfil: new FormControl(usuarioRawValue.perfil),
      grupos: new FormControl(usuarioRawValue.grupos ?? []),
      admin: new FormControl(usuarioRawValue.admin),
    });
  }

  getUsuario(form: UsuarioFormGroup): IUsuario | NewUsuario {
    return form.getRawValue() as IUsuario | NewUsuario;
  }

  resetForm(form: UsuarioFormGroup, usuario: UsuarioFormGroupInput): void {
    const usuarioRawValue = { ...this.getFormDefaults(), ...usuario };
    form.reset(
      {
        ...usuarioRawValue,
        id: { value: usuarioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UsuarioFormDefaults {
    return {
      id: null,
      grupos: [],
    };
  }
}
