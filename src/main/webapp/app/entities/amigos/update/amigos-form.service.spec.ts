import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../amigos.test-samples';

import { AmigosFormService } from './amigos-form.service';

describe('Amigos Form Service', () => {
  let service: AmigosFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmigosFormService);
  });

  describe('Service methods', () => {
    describe('createAmigosFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAmigosFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cantidad: expect.any(Object),
            amigosComun: expect.any(Object),
            usuario: expect.any(Object),
          })
        );
      });

      it('passing IAmigos should create a new form with FormGroup', () => {
        const formGroup = service.createAmigosFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cantidad: expect.any(Object),
            amigosComun: expect.any(Object),
            usuario: expect.any(Object),
          })
        );
      });
    });

    describe('getAmigos', () => {
      it('should return NewAmigos for default Amigos initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAmigosFormGroup(sampleWithNewData);

        const amigos = service.getAmigos(formGroup) as any;

        expect(amigos).toMatchObject(sampleWithNewData);
      });

      it('should return NewAmigos for empty Amigos initial value', () => {
        const formGroup = service.createAmigosFormGroup();

        const amigos = service.getAmigos(formGroup) as any;

        expect(amigos).toMatchObject({});
      });

      it('should return IAmigos', () => {
        const formGroup = service.createAmigosFormGroup(sampleWithRequiredData);

        const amigos = service.getAmigos(formGroup) as any;

        expect(amigos).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAmigos should not enable id FormControl', () => {
        const formGroup = service.createAmigosFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAmigos should disable id FormControl', () => {
        const formGroup = service.createAmigosFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
