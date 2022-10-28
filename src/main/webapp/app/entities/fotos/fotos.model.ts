import { IAlbum } from 'app/entities/album/album.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IFotos {
  id: number;
  descripcion?: string | null;
  album?: Pick<IAlbum, 'id'> | null;
  usuario?: Pick<IUsuario, 'id'> | null;
}

export type NewFotos = Omit<IFotos, 'id'> & { id: null };
