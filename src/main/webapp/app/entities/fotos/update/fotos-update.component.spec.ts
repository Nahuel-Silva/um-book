import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FotosFormService } from './fotos-form.service';
import { FotosService } from '../service/fotos.service';
import { IFotos } from '../fotos.model';
import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { FotosUpdateComponent } from './fotos-update.component';

describe('Fotos Management Update Component', () => {
  let comp: FotosUpdateComponent;
  let fixture: ComponentFixture<FotosUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fotosFormService: FotosFormService;
  let fotosService: FotosService;
  let albumService: AlbumService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FotosUpdateComponent],
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
      .overrideTemplate(FotosUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FotosUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fotosFormService = TestBed.inject(FotosFormService);
    fotosService = TestBed.inject(FotosService);
    albumService = TestBed.inject(AlbumService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Album query and add missing value', () => {
      const fotos: IFotos = { id: 456 };
      const album: IAlbum = { id: 16310 };
      fotos.album = album;

      const albumCollection: IAlbum[] = [{ id: 3378 }];
      jest.spyOn(albumService, 'query').mockReturnValue(of(new HttpResponse({ body: albumCollection })));
      const additionalAlbums = [album];
      const expectedCollection: IAlbum[] = [...additionalAlbums, ...albumCollection];
      jest.spyOn(albumService, 'addAlbumToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fotos });
      comp.ngOnInit();

      expect(albumService.query).toHaveBeenCalled();
      expect(albumService.addAlbumToCollectionIfMissing).toHaveBeenCalledWith(
        albumCollection,
        ...additionalAlbums.map(expect.objectContaining)
      );
      expect(comp.albumsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Usuario query and add missing value', () => {
      const fotos: IFotos = { id: 456 };
      const usuario: IUsuario = { id: 67763 };
      fotos.usuario = usuario;

      const usuarioCollection: IUsuario[] = [{ id: 97519 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [usuario];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fotos });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining)
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const fotos: IFotos = { id: 456 };
      const album: IAlbum = { id: 88154 };
      fotos.album = album;
      const usuario: IUsuario = { id: 48916 };
      fotos.usuario = usuario;

      activatedRoute.data = of({ fotos });
      comp.ngOnInit();

      expect(comp.albumsSharedCollection).toContain(album);
      expect(comp.usuariosSharedCollection).toContain(usuario);
      expect(comp.fotos).toEqual(fotos);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFotos>>();
      const fotos = { id: 123 };
      jest.spyOn(fotosFormService, 'getFotos').mockReturnValue(fotos);
      jest.spyOn(fotosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fotos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fotos }));
      saveSubject.complete();

      // THEN
      expect(fotosFormService.getFotos).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(fotosService.update).toHaveBeenCalledWith(expect.objectContaining(fotos));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFotos>>();
      const fotos = { id: 123 };
      jest.spyOn(fotosFormService, 'getFotos').mockReturnValue({ id: null });
      jest.spyOn(fotosService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fotos: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fotos }));
      saveSubject.complete();

      // THEN
      expect(fotosFormService.getFotos).toHaveBeenCalled();
      expect(fotosService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFotos>>();
      const fotos = { id: 123 };
      jest.spyOn(fotosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fotos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fotosService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAlbum', () => {
      it('Should forward to albumService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(albumService, 'compareAlbum');
        comp.compareAlbum(entity, entity2);
        expect(albumService.compareAlbum).toHaveBeenCalledWith(entity, entity2);
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
