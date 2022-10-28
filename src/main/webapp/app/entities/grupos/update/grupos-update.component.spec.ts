import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GruposFormService } from './grupos-form.service';
import { GruposService } from '../service/grupos.service';
import { IGrupos } from '../grupos.model';
import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';

import { GruposUpdateComponent } from './grupos-update.component';

describe('Grupos Management Update Component', () => {
  let comp: GruposUpdateComponent;
  let fixture: ComponentFixture<GruposUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gruposFormService: GruposFormService;
  let gruposService: GruposService;
  let albumService: AlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GruposUpdateComponent],
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
      .overrideTemplate(GruposUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GruposUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gruposFormService = TestBed.inject(GruposFormService);
    gruposService = TestBed.inject(GruposService);
    albumService = TestBed.inject(AlbumService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Album query and add missing value', () => {
      const grupos: IGrupos = { id: 456 };
      const albums: IAlbum[] = [{ id: 85897 }];
      grupos.albums = albums;

      const albumCollection: IAlbum[] = [{ id: 76039 }];
      jest.spyOn(albumService, 'query').mockReturnValue(of(new HttpResponse({ body: albumCollection })));
      const additionalAlbums = [...albums];
      const expectedCollection: IAlbum[] = [...additionalAlbums, ...albumCollection];
      jest.spyOn(albumService, 'addAlbumToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ grupos });
      comp.ngOnInit();

      expect(albumService.query).toHaveBeenCalled();
      expect(albumService.addAlbumToCollectionIfMissing).toHaveBeenCalledWith(
        albumCollection,
        ...additionalAlbums.map(expect.objectContaining)
      );
      expect(comp.albumsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const grupos: IGrupos = { id: 456 };
      const album: IAlbum = { id: 47859 };
      grupos.albums = [album];

      activatedRoute.data = of({ grupos });
      comp.ngOnInit();

      expect(comp.albumsSharedCollection).toContain(album);
      expect(comp.grupos).toEqual(grupos);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrupos>>();
      const grupos = { id: 123 };
      jest.spyOn(gruposFormService, 'getGrupos').mockReturnValue(grupos);
      jest.spyOn(gruposService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grupos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grupos }));
      saveSubject.complete();

      // THEN
      expect(gruposFormService.getGrupos).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gruposService.update).toHaveBeenCalledWith(expect.objectContaining(grupos));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrupos>>();
      const grupos = { id: 123 };
      jest.spyOn(gruposFormService, 'getGrupos').mockReturnValue({ id: null });
      jest.spyOn(gruposService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grupos: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grupos }));
      saveSubject.complete();

      // THEN
      expect(gruposFormService.getGrupos).toHaveBeenCalled();
      expect(gruposService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrupos>>();
      const grupos = { id: 123 };
      jest.spyOn(gruposService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grupos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gruposService.update).toHaveBeenCalled();
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
  });
});
