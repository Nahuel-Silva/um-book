import { IComentarios, NewComentarios } from './comentarios.model';

export const sampleWithRequiredData: IComentarios = {
  id: 32075,
};

export const sampleWithPartialData: IComentarios = {
  id: 14358,
  descripcion: 'calculate',
};

export const sampleWithFullData: IComentarios = {
  id: 72260,
  descripcion: 'Blanco Contabilidad',
};

export const sampleWithNewData: NewComentarios = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
