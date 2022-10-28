import { IAlbum } from 'app/entities/album/album.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IGrupos {
  id: number;
  nombre?: string | null;
  cantPersonas?: string | null;
  albums?: Pick<IAlbum, 'id'>[] | null;
  usuarios?: Pick<IUsuario, 'id'>[] | null;
}

export type NewGrupos = Omit<IGrupos, 'id'> & { id: null };
