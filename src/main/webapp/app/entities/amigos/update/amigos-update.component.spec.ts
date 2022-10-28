import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AmigosFormService } from './amigos-form.service';
import { AmigosService } from '../service/amigos.service';
import { IAmigos } from '../amigos.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { AmigosUpdateComponent } from './amigos-update.component';

describe('Amigos Management Update Component', () => {
  let comp: AmigosUpdateComponent;
  let fixture: ComponentFixture<AmigosUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let amigosFormService: AmigosFormService;
  let amigosService: AmigosService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AmigosUpdateComponent],
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
      .overrideTemplate(AmigosUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AmigosUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    amigosFormService = TestBed.inject(AmigosFormService);
    amigosService = TestBed.inject(AmigosService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Usuario query and add missing value', () => {
      const amigos: IAmigos = { id: 456 };
      const usuario: IUsuario = { id: 74580 };
      amigos.usuario = usuario;

      const usuarioCollection: IUsuario[] = [{ id: 32794 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [usuario];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ amigos });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining)
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const amigos: IAmigos = { id: 456 };
      const usuario: IUsuario = { id: 5770 };
      amigos.usuario = usuario;

      activatedRoute.data = of({ amigos });
      comp.ngOnInit();

      expect(comp.usuariosSharedCollection).toContain(usuario);
      expect(comp.amigos).toEqual(amigos);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAmigos>>();
      const amigos = { id: 123 };
      jest.spyOn(amigosFormService, 'getAmigos').mockReturnValue(amigos);
      jest.spyOn(amigosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amigos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: amigos }));
      saveSubject.complete();

      // THEN
      expect(amigosFormService.getAmigos).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(amigosService.update).toHaveBeenCalledWith(expect.objectContaining(amigos));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAmigos>>();
      const amigos = { id: 123 };
      jest.spyOn(amigosFormService, 'getAmigos').mockReturnValue({ id: null });
      jest.spyOn(amigosService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amigos: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: amigos }));
      saveSubject.complete();

      // THEN
      expect(amigosFormService.getAmigos).toHaveBeenCalled();
      expect(amigosService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAmigos>>();
      const amigos = { id: 123 };
      jest.spyOn(amigosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amigos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(amigosService.update).toHaveBeenCalled();
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
