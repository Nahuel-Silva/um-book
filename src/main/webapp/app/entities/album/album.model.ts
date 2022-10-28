import { IPerfil } from 'app/entities/perfil/perfil.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { IGrupos } from 'app/entities/grupos/grupos.model';

export interface IAlbum {
  id: number;
  nombre?: string | null;
  descripcion?: string | null;
  cantFotos?: number | null;
  perfil?: Pick<IPerfil, 'id'> | null;
  usuario?: Pick<IUsuario, 'id'> | null;
  grupos?: Pick<IGrupos, 'id'>[] | null;
}

export type NewAlbum = Omit<IAlbum, 'id'> & { id: null };
