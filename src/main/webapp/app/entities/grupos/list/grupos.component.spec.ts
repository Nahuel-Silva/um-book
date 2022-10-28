import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GruposService } from '../service/grupos.service';

import { GruposComponent } from './grupos.component';

describe('Grupos Management Component', () => {
  let comp: GruposComponent;
  let fixture: ComponentFixture<GruposComponent>;
  let service: GruposService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'grupos', component: GruposComponent }]), HttpClientTestingModule],
      declarations: [GruposComponent],
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
      .overrideTemplate(GruposComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GruposComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GruposService);

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
    expect(comp.grupos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to gruposService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getGruposIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGruposIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
