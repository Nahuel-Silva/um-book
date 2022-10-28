import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NotificacionesFormService } from './notificaciones-form.service';
import { NotificacionesService } from '../service/notificaciones.service';
import { INotificaciones } from '../notificaciones.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { NotificacionesUpdateComponent } from './notificaciones-update.component';

describe('Notificaciones Management Update Component', () => {
  let comp: NotificacionesUpdateComponent;
  let fixture: ComponentFixture<NotificacionesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let notificacionesFormService: NotificacionesFormService;
  let notificacionesService: NotificacionesService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NotificacionesUpdateComponent],
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
      .overrideTemplate(NotificacionesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NotificacionesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    notificacionesFormService = TestBed.inject(NotificacionesFormService);
    notificacionesService = TestBed.inject(NotificacionesService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Usuario query and add missing value', () => {
      const notificaciones: INotificaciones = { id: 456 };
      const usuario: IUsuario = { id: 65933 };
      notificaciones.usuario = usuario;

      const usuarioCollection: IUsuario[] = [{ id: 36075 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [usuario];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ notificaciones });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining)
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const notificaciones: INotificaciones = { id: 456 };
      const usuario: IUsuario = { id: 81339 };
      notificaciones.usuario = usuario;

      activatedRoute.data = of({ notificaciones });
      comp.ngOnInit();

      expect(comp.usuariosSharedCollection).toContain(usuario);
      expect(comp.notificaciones).toEqual(notificaciones);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INotificaciones>>();
      const notificaciones = { id: 123 };
      jest.spyOn(notificacionesFormService, 'getNotificaciones').mockReturnValue(notificaciones);
      jest.spyOn(notificacionesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notificaciones });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notificaciones }));
      saveSubject.complete();

      // THEN
      expect(notificacionesFormService.getNotificaciones).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(notificacionesService.update).toHaveBeenCalledWith(expect.objectContaining(notificaciones));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INotificaciones>>();
      const notificaciones = { id: 123 };
      jest.spyOn(notificacionesFormService, 'getNotificaciones').mockReturnValue({ id: null });
      jest.spyOn(notificacionesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notificaciones: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notificaciones }));
      saveSubject.complete();

      // THEN
      expect(notificacionesFormService.getNotificaciones).toHaveBeenCalled();
      expect(notificacionesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INotificaciones>>();
      const notificaciones = { id: 123 };
      jest.spyOn(notificacionesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notificaciones });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(notificacionesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUsuario', () => {
      it('Should forward to usuarioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(usuarioService, 'compareUsuario');
        comp.compareUsuario(entity, entity2);
        expect(usuarioService.compareUsuario).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
