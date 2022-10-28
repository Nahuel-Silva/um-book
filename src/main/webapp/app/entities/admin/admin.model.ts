export interface IAdmin {
  id: number;
  nombre?: string | null;
  apellido?: string | null;
  mail?: string | null;
  password?: string | null;
  tipoUsuario?: string | null;
}

export type NewAdmin = Omit<IAdmin, 'id'> & { id: null };
