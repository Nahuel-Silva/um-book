import { IAlbum, NewAlbum } from './album.model';

export const sampleWithRequiredData: IAlbum = {
  id: 51589,
};

export const sampleWithPartialData: IAlbum = {
  id: 98063,
  descripcion: 'fritas',
};

export const sampleWithFullData: IAlbum = {
  id: 81956,
  nombre: 'coherente',
  descripcion: 'deliver value-added núcleo',
  cantFotos: 48483,
};

export const sampleWithNewData: NewAlbum = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
