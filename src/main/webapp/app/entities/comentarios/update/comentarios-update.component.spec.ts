import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ComentariosFormService } from './comentarios-form.service';
import { ComentariosService } from '../service/comentarios.service';
import { IComentarios } from '../comentarios.model';
import { IFotos } from 'app/entities/fotos/fotos.model';
import { FotosService } from 'app/entities/fotos/service/fotos.service';

import { ComentariosUpdateComponent } from './comentarios-update.component';

describe('Comentarios Management Update Component', () => {
  let comp: ComentariosUpdateComponent;
  let fixture: ComponentFixture<ComentariosUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let comentariosFormService: ComentariosFormService;
  let comentariosService: ComentariosService;
  let fotosService: FotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ComentariosUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ComentariosUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ComentariosUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    comentariosFormService = TestBed.inject(ComentariosFormService);
    comentariosService = TestBed.inject(ComentariosService);
    fotosService = TestBed.inject(FotosService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Fotos query and add missing value', () => {
      const comentarios: IComentarios = { id: 456 };
      const fotos: IFotos = { id: 76547 };
      comentarios.fotos = fotos;

      const fotosCollection: IFotos[] = [{ id: 35727 }];
      jest.spyOn(fotosService, 'query').mockReturnValue(of(new HttpResponse({ body: fotosCollection })));
      const additionalFotos = [fotos];
      const expectedCollection: IFotos[] = [...additionalFotos, ...fotosCollection];
      jest.spyOn(fotosService, 'addFotosToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comentarios });
      comp.ngOnInit();

      expect(fotosService.query).toHaveBeenCalled();
      expect(fotosService.addFotosToCollectionIfMissing).toHaveBeenCalledWith(
        fotosCollection,
        ...additionalFotos.map(expect.objectContaining)
      );
      expect(comp.fotosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const comentarios: IComentarios = { id: 456 };
      const fotos: IFotos = { id: 86548 };
      comentarios.fotos = fotos;

      activatedRoute.data = of({ comentarios });
      comp.ngOnInit();

      expect(comp.fotosSharedCollection).toContain(fotos);
      expect(comp.comentarios).toEqual(comentarios);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComentarios>>();
      const comentarios = { id: 123 };
      jest.spyOn(comentariosFormService, 'getComentarios').mockReturnValue(comentarios);
      jest.spyOn(comentariosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comentarios });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comentarios }));
      saveSubject.complete();

      // THEN
      expect(comentariosFormService.getComentarios).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(comentariosService.update).toHaveBeenCalledWith(expect.objectContaining(comentarios));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComentarios>>();
      const comentarios = { id: 123 };
      jest.spyOn(comentariosFormService, 'getComentarios').mockReturnValue({ id: null });
      jest.spyOn(comentariosService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comentarios: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comentarios }));
      saveSubject.complete();

      // THEN
      expect(comentariosFormService.getComentarios).toHaveBeenCalled();
      expect(comentariosService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComentarios>>();
      const comentarios = { id: 123 };
      jest.spyOn(comentariosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comentarios });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(comentariosService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareFotos', () => {
      it('Should forward to fotosService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(fotosService, 'compareFotos');
        comp.compareFotos(entity, entity2);
        expect(fotosService.compareFotos).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
