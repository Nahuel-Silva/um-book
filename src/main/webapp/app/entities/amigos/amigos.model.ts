import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IAmigos {
  id: number;
  cantidad?: number | null;
  amigosComun?: string | null;
  usuario?: Pick<IUsuario, 'id'> | null;
}

export type NewAmigos = Omit<IAmigos, 'id'> & { id: null };
