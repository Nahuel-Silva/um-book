import { IGrupos, NewGrupos } from './grupos.model';

export const sampleWithRequiredData: IGrupos = {
  id: 89834,
};

export const sampleWithPartialData: IGrupos = {
  id: 59739,
};

export const sampleWithFullData: IGrupos = {
  id: 67729,
  nombre: 'website',
  cantPersonas: 'generate Cuentas',
};

export const sampleWithNewData: NewGrupos = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
