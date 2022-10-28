import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FotosService } from '../service/fotos.service';

import { FotosComponent } from './fotos.component';

describe('Fotos Management Component', () => {
  let comp: FotosComponent;
  let fixture: ComponentFixture<FotosComponent>;
  let service: FotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'fotos', component: FotosComponent }]), HttpClientTestingModule],
      declarations: [FotosComponent],
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
      .overrideTemplate(FotosComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FotosComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FotosService);

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
    expect(comp.fotos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to fotosService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFotosIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFotosIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
