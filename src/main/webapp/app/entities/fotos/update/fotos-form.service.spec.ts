import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fotos.test-samples';

import { FotosFormService } from './fotos-form.service';

describe('Fotos Form Service', () => {
  let service: FotosFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FotosFormService);
  });

  describe('Service methods', () => {
    describe('createFotosFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFotosFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descripcion: expect.any(Object),
            album: expect.any(Object),
            usuario: expect.any(Object),
          })
        );
      });

      it('passing IFotos should create a new form with FormGroup', () => {
        const formGroup = service.createFotosFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descripcion: expect.any(Object),
            album: expect.any(Object),
            usuario: expect.any(Object),
          })
        );
      });
    });

    describe('getFotos', () => {
      it('should return NewFotos for default Fotos initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFotosFormGroup(sampleWithNewData);

        const fotos = service.getFotos(formGroup) as any;

        expect(fotos).toMatchObject(sampleWithNewData);
      });

      it('should return NewFotos for empty Fotos initial value', () => {
        const formGroup = service.createFotosFormGroup();

        const fotos = service.getFotos(formGroup) as any;

        expect(fotos).toMatchObject({});
      });

      it('should return IFotos', () => {
        const formGroup = service.createFotosFormGroup(sampleWithRequiredData);

        const fotos = service.getFotos(formGroup) as any;

        expect(fotos).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFotos should not enable id FormControl', () => {
        const formGroup = service.createFotosFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFotos should disable id FormControl', () => {
        const formGroup = service.createFotosFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
