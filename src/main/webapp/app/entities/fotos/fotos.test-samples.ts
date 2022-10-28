import { IFotos, NewFotos } from './fotos.model';

export const sampleWithRequiredData: IFotos = {
  id: 11461,
};

export const sampleWithPartialData: IFotos = {
  id: 46034,
};

export const sampleWithFullData: IFotos = {
  id: 57267,
  descripcion: 'quantify clicks-and-mortar deposit',
};

export const sampleWithNewData: NewFotos = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
