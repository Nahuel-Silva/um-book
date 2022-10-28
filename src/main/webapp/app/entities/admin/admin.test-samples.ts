import { IAdmin, NewAdmin } from './admin.model';

export const sampleWithRequiredData: IAdmin = {
  id: 39001,
};

export const sampleWithPartialData: IAdmin = {
  id: 95143,
  nombre: 'Seguridada Fantástico',
  apellido: 'Pakistan interface iterate',
};

export const sampleWithFullData: IAdmin = {
  id: 26434,
  nombre: 'online',
  apellido: 'Iraqi',
  mail: 'Agente methodologies cultivate',
  password: 'red',
  tipoUsuario: 'Brasil Cantabria web',
};

export const sampleWithNewData: NewAdmin = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
