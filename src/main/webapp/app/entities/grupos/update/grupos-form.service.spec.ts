import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../grupos.test-samples';

import { GruposFormService } from './grupos-form.service';

describe('Grupos Form Service', () => {
  let service: GruposFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GruposFormService);
  });

  describe('Service methods', () => {
    describe('createGruposFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGruposFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            cantPersonas: expect.any(Object),
            albums: expect.any(Object),
            usuarios: expect.any(Object),
          })
        );
      });

      it('passing IGrupos should create a new form with FormGroup', () => {
        const formGroup = service.createGruposFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            cantPersonas: expect.any(Object),
            albums: expect.any(Object),
            usuarios: expect.any(Object),
          })
        );
      });
    });

    describe('getGrupos', () => {
      it('should return NewGrupos for default Grupos initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGruposFormGroup(sampleWithNewData);

        const grupos = service.getGrupos(formGroup) as any;

        expect(grupos).toMatchObject(sampleWithNewData);
      });

      it('should return NewGrupos for empty Grupos initial value', () => {
        const formGroup = service.createGruposFormGroup();

        const grupos = service.getGrupos(formGroup) as any;

        expect(grupos).toMatchObject({});
      });

      it('should return IGrupos', () => {
        const formGroup = service.createGruposFormGroup(sampleWithRequiredData);

        const grupos = service.getGrupos(formGroup) as any;

        expect(grupos).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGrupos should not enable id FormControl', () => {
        const formGroup = service.createGruposFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGrupos should disable id FormControl', () => {
        const formGroup = service.createGruposFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
