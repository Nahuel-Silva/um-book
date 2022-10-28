import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AlbumFormService } from './album-form.service';
import { AlbumService } from '../service/album.service';
import { IAlbum } from '../album.model';
import { IPerfil } from 'app/entities/perfil/perfil.model';
import { PerfilService } from 'app/entities/perfil/service/perfil.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { AlbumUpdateComponent } from './album-update.component';

describe('Album Management Update Component', () => {
  let comp: AlbumUpdateComponent;
  let fixture: ComponentFixture<AlbumUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let albumFormService: AlbumFormService;
  let albumService: AlbumService;
  let perfilService: PerfilService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AlbumUpdateComponent],
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
      .overrideTemplate(AlbumUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlbumUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    albumFormService = TestBed.inject(AlbumFormService);
    albumService = TestBed.inject(AlbumService);
    perfilService = TestBed.inject(PerfilService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Perfil query and add missing value', () => {
      const album: IAlbum = { id: 456 };
      const perfil: IPerfil = { id: 15217 };
      album.perfil = perfil;

      const perfilCollection: IPerfil[] = [{ id: 38169 }];
      jest.spyOn(perfilService, 'query').mockReturnValue(of(new HttpResponse({ body: perfilCollection })));
      const additionalPerfils = [perfil];
      const expectedCollection: IPerfil[] = [...additionalPerfils, ...perfilCollection];
      jest.spyOn(perfilService, 'addPerfilToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(perfilService.query).toHaveBeenCalled();
      expect(perfilService.addPerfilToCollectionIfMissing).toHaveBeenCalledWith(
        perfilCollection,
        ...additionalPerfils.map(expect.objectContaining)
      );
      expect(comp.perfilsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Usuario query and add missing value', () => {
      const album: IAlbum = { id: 456 };
      const usuario: IUsuario = { id: 54158 };
      album.usuario = usuario;

      const usuarioCollection: IUsuario[] = [{ id: 72112 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [usuario];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining)
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const album: IAlbum = { id: 456 };
      const perfil: IPerfil = { id: 68458 };
      album.perfil = perfil;
      const usuario: IUsuario = { id: 71162 };
      album.usuario = usuario;

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(comp.perfilsSharedCollection).toContain(perfil);
      expect(comp.usuariosSharedCollection).toContain(usuario);
      expect(comp.album).toEqual(album);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlbum>>();
      const album = { id: 123 };
      jest.spyOn(albumFormService, 'getAlbum').mockReturnValue(album);
      jest.spyOn(albumService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ album });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: album }));
      saveSubject.complete();

      // THEN
      expect(albumFormService.getAlbum).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(albumService.update).toHaveBeenCalledWith(expect.objectContaining(album));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlbum>>();
      const album = { id: 123 };
      jest.spyOn(albumFormService, 'getAlbum').mockReturnValue({ id: null });
      jest.spyOn(albumService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ album: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: album }));
      saveSubject.complete();

      // THEN
      expect(albumFormService.getAlbum).toHaveBeenCalled();
      expect(albumService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlbum>>();
      const album = { id: 123 };
      jest.spyOn(albumService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ album });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(albumService.update).toHaveBeenCalled();
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
