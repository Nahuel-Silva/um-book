import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PerfilService } from '../service/perfil.service';

import { PerfilComponent } from './perfil.component';

describe('Perfil Management Component', () => {
  let comp: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let service: PerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'perfil', component: PerfilComponent }]), HttpClientTestingModule],
      declarations: [PerfilComponent],
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
      .overrideTemplate(PerfilComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PerfilService);

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
    expect(comp.perfils?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to perfilService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPerfilIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPerfilIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
