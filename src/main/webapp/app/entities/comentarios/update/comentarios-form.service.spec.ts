import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../comentarios.test-samples';

import { ComentariosFormService } from './comentarios-form.service';

describe('Comentarios Form Service', () => {
  let service: ComentariosFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComentariosFormService);
  });

  describe('Service methods', () => {
    describe('createComentariosFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createComentariosFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descripcion: expect.any(Object),
            fotos: expect.any(Object),
          })
        );
      });

      it('passing IComentarios should create a new form with FormGroup', () => {
        const formGroup = service.createComentariosFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descripcion: expect.any(Object),
            fotos: expect.any(Object),
          })
        );
      });
    });

    describe('getComentarios', () => {
      it('should return NewComentarios for default Comentarios initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createComentariosFormGroup(sampleWithNewData);

        const comentarios = service.getComentarios(formGroup) as any;

        expect(comentarios).toMatchObject(sampleWithNewData);
      });

      it('should return NewComentarios for empty Comentarios initial value', () => {
        const formGroup = service.createComentariosFormGroup();

        const comentarios = service.getComentarios(formGroup) as any;

        expect(comentarios).toMatchObject({});
      });

      it('should return IComentarios', () => {
        const formGroup = service.createComentariosFormGroup(sampleWithRequiredData);

        const comentarios = service.getComentarios(formGroup) as any;

        expect(comentarios).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IComentarios should not enable id FormControl', () => {
        const formGroup = service.createComentariosFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewComentarios should disable id FormControl', () => {
        const formGroup = service.createComentariosFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
