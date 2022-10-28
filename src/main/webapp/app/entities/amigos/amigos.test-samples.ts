import { IAmigos, NewAmigos } from './amigos.model';

export const sampleWithRequiredData: IAmigos = {
  id: 59455,
};

export const sampleWithPartialData: IAmigos = {
  id: 38447,
  cantidad: 49809,
};

export const sampleWithFullData: IAmigos = {
  id: 38649,
  cantidad: 31765,
  amigosComun: 'PCI',
};

export const sampleWithNewData: NewAmigos = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
