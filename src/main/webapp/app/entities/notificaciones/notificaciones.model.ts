import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface INotificaciones {
  id: number;
  tipoNotificacion?: string | null;
  usuario?: Pick<IUsuario, 'id'> | null;
}

export type NewNotificaciones = Omit<INotificaciones, 'id'> & { id: null };
