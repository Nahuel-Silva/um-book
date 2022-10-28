import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UsuarioFormService } from './usuario-form.service';
import { UsuarioService } from '../service/usuario.service';
import { IUsuario } from '../usuario.model';
import { IPerfil } from 'app/entities/perfil/perfil.model';
import { PerfilService } from 'app/entities/perfil/service/perfil.service';
import { IGrupos } from 'app/entities/grupos/grupos.model';
import { GruposService } from 'app/entities/grupos/service/grupos.service';
import { IAdmin } from 'app/entities/admin/admin.model';
import { AdminService } from 'app/entities/admin/service/admin.service';

import { UsuarioUpdateComponent } from './usuario-update.component';

describe('Usuario Management Update Component', () => {
  let comp: UsuarioUpdateComponent;
  let fixture: ComponentFixture<UsuarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let usuarioFormService: UsuarioFormService;
  let usuarioService: UsuarioService;
  let perfilService: PerfilService;
  let gruposService: GruposService;
  let adminService: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UsuarioUpdateComponent],
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
      .overrideTemplate(UsuarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UsuarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    usuarioFormService = TestBed.inject(UsuarioFormService);
    usuarioService = TestBed.inject(UsuarioService);
    perfilService = TestBed.inject(PerfilService);
    gruposService = TestBed.inject(GruposService);
    adminService = TestBed.inject(AdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call perfil query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const perfil: IPerfil = { id: 36881 };
      usuario.perfil = perfil;

      const perfilCollection: IPerfil[] = [{ id: 54811 }];
      jest.spyOn(perfilService, 'query').mockReturnValue(of(new HttpResponse({ body: perfilCollection })));
      const expectedCollection: IPerfil[] = [perfil, ...perfilCollection];
      jest.spyOn(perfilService, 'addPerfilToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(perfilService.query).toHaveBeenCalled();
      expect(perfilService.addPerfilToCollectionIfMissing).toHaveBeenCalledWith(perfilCollection, perfil);
      expect(comp.perfilsCollection).toEqual(expectedCollection);
    });

    it('Should call Grupos query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const grupos: IGrupos[] = [{ id: 10695 }];
      usuario.grupos = grupos;

      const gruposCollection: IGrupos[] = [{ id: 42721 }];
      jest.spyOn(gruposService, 'query').mockReturnValue(of(new HttpResponse({ body: gruposCollection })));
      const additionalGrupos = [...grupos];
      const expectedCollection: IGrupos[] = [...additionalGrupos, ...gruposCollection];
      jest.spyOn(gruposService, 'addGruposToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(gruposService.query).toHaveBeenCalled();
      expect(gruposService.addGruposToCollectionIfMissing).toHaveBeenCalledWith(
        gruposCollection,
        ...additionalGrupos.map(expect.objectContaining)
      );
      expect(comp.gruposSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Admin query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const admin: IAdmin = { id: 20653 };
      usuario.admin = admin;

      const adminCollection: IAdmin[] = [{ id: 64983 }];
      jest.spyOn(adminService, 'query').mockReturnValue(of(new HttpResponse({ body: adminCollection })));
      const additionalAdmins = [admin];
      const expectedCollection: IAdmin[] = [...additionalAdmins, ...adminCollection];
      jest.spyOn(adminService, 'addAdminToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(adminService.query).toHaveBeenCalled();
      expect(adminService.addAdminToCollectionIfMissing).toHaveBeenCalledWith(
        adminCollection,
        ...additionalAdmins.map(expect.objectContaining)
      );
      expect(comp.adminsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const usuario: IUsuario = { id: 456 };
      const perfil: IPerfil = { id: 8494 };
      usuario.perfil = perfil;
      const grupos: IGrupos = { id: 4343 };
      usuario.grupos = [grupos];
      const admin: IAdmin = { id: 28379 };
      usuario.admin = admin;

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(comp.perfilsCollection).toContain(perfil);
      expect(comp.gruposSharedCollection).toContain(grupos);
      expect(comp.adminsSharedCollection).toContain(admin);
      expect(comp.usuario).toEqual(usuario);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUsuario>>();
      const usuario = { id: 123 };
      jest.spyOn(usuarioFormService, 'getUsuario').mockReturnValue(usuario);
      jest.spyOn(usuarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: usuario }));
      saveSubject.complete();

      // THEN
      expect(usuarioFormService.getUsuario).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(usuarioService.update).toHaveBeenCalledWith(expect.objectContaining(usuario));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUsuario>>();
      const usuario = { id: 123 };
      jest.spyOn(usuarioFormService, 'getUsuario').mockReturnValue({ id: null });
      jest.spyOn(usuarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usuario: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: usuario }));
      saveSubject.complete();

      // THEN
      expect(usuarioFormService.getUsuario).toHaveBeenCalled();
      expect(usuarioService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUsuario>>();
      const usuario = { id: 123 };
      jest.spyOn(usuarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(usuarioService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePerfil', () => {
      it('Should forward to perfilService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(perfilService, 'comparePerfil');
        comp.comparePerfil(entity, entity2);
        expect(perfilService.comparePerfil).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGrupos', () => {
      it('Should forward to gruposService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(gruposService, 'compareGrupos');
        comp.compareGrupos(entity, entity2);
        expect(gruposService.compareGrupos).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAdmin', () => {
      it('Should forward to adminService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(adminService, 'compareAdmin');
        comp.compareAdmin(entity, entity2);
        expect(adminService.compareAdmin).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
