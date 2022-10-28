import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ComentariosService } from '../service/comentarios.service';

import { ComentariosComponent } from './comentarios.component';

describe('Comentarios Management Component', () => {
  let comp: ComentariosComponent;
  let fixture: ComponentFixture<ComentariosComponent>;
  let service: ComentariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'comentarios', component: ComentariosComponent }]), HttpClientTestingModule],
      declarations: [ComentariosComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ComentariosComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ComentariosComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ComentariosService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.comentarios?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to comentariosService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getComentariosIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getComentariosIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
