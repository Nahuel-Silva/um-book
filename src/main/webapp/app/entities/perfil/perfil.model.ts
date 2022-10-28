export interface IPerfil {
  id: number;
  cantAlbumes?: number | null;
  cantSeguidores?: number | null;
  cantSeguidos?: number | null;
  descripcion?: string | null;
}

export type NewPerfil = Omit<IPerfil, 'id'> & { id: null };
