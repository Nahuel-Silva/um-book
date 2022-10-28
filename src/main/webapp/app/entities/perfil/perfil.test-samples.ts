import { IPerfil, NewPerfil } from './perfil.model';

export const sampleWithRequiredData: IPerfil = {
  id: 84740,
};

export const sampleWithPartialData: IPerfil = {
  id: 39032,
  cantSeguidos: 30251,
};

export const sampleWithFullData: IPerfil = {
  id: 38177,
  cantAlbumes: 47377,
  cantSeguidores: 6479,
  cantSeguidos: 2751,
  descripcion: 'Madera Andalucía',
};

export const sampleWithNewData: NewPerfil = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
