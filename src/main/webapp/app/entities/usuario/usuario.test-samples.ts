import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 19585,
};

export const sampleWithPartialData: IUsuario = {
  id: 32418,
  mail: 'Hogar firewall',
  tipoUsuario: 'Morado',
};

export const sampleWithFullData: IUsuario = {
  id: 78199,
  nombre: 'Barrio',
  apellido: 'Oficial instalación',
  mail: 'Savings Bacon arquitectura',
  password: 'Tenge',
  tipoUsuario: 'transmitter Senior',
};

export const sampleWithNewData: NewUsuario = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
