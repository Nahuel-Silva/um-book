import { IFotos } from 'app/entities/fotos/fotos.model';

export interface IComentarios {
  id: number;
  descripcion?: string | null;
  fotos?: Pick<IFotos, 'id'> | null;
}

export type NewComentarios = Omit<IComentarios, 'id'> & { id: null };
