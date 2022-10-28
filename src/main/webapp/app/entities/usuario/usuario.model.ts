import { IPerfil } from 'app/entities/perfil/perfil.model';
import { IGrupos } from 'app/entities/grupos/grupos.model';
import { IAdmin } from 'app/entities/admin/admin.model';

export interface IUsuario {
  id: number;
  nombre?: string | null;
  apellido?: string | null;
  mail?: string | null;
  password?: string | null;
  tipoUsuario?: string | null;
  perfil?: Pick<IPerfil, 'id'> | null;
  grupos?: Pick<IGrupos, 'id'>[] | null;
  admin?: Pick<IAdmin, 'id'> | null;
}

export type NewUsuario = Omit<IUsuario, 'id'> & { id: null };
