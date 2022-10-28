import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../notificaciones.test-samples';

import { NotificacionesFormService } from './notificaciones-form.service';

describe('Notificaciones Form Service', () => {
  let service: NotificacionesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionesFormService);
  });

  describe('Service methods', () => {
    describe('createNotificacionesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNotificacionesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipoNotificacion: expect.any(Object),
            usuario: expect.any(Object),
          })
        );
      });

      it('passing INotificaciones should create a new form with FormGroup', () => {
        const formGroup = service.createNotificacionesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipoNotificacion: expect.any(Object),
            usuario: expect.any(Object),
          })
        );
      });
    });

    describe('getNotificaciones', () => {
      it('should return NewNotificaciones for default Notificaciones initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createNotificacionesFormGroup(sampleWithNewData);

        const notificaciones = service.getNotificaciones(formGroup) as any;

        expect(notificaciones).toMatchObject(sampleWithNewData);
      });

      it('should return NewNotificaciones for empty Notificaciones initial value', () => {
        const formGroup = service.createNotificacionesFormGroup();

        const notificaciones = service.getNotificaciones(formGroup) as any;

        expect(notificaciones).toMatchObject({});
      });

      it('should return INotificaciones', () => {
        const formGroup = service.createNotificacionesFormGroup(sampleWithRequiredData);

        const notificaciones = service.getNotificaciones(formGroup) as any;

        expect(notificaciones).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INotificaciones should not enable id FormControl', () => {
        const formGroup = service.createNotificacionesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNotificaciones should disable id FormControl', () => {
        const formGroup = service.createNotificacionesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
