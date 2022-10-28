import { INotificaciones, NewNotificaciones } from './notificaciones.model';

export const sampleWithRequiredData: INotificaciones = {
  id: 13529,
};

export const sampleWithPartialData: INotificaciones = {
  id: 36698,
  tipoNotificacion: 'ADP',
};

export const sampleWithFullData: INotificaciones = {
  id: 21354,
  tipoNotificacion: 'streamline Re-implementado',
};

export const sampleWithNewData: NewNotificaciones = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
