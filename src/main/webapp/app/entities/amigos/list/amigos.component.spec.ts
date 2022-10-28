import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AmigosService } from '../service/amigos.service';

import { AmigosComponent } from './amigos.component';

describe('Amigos Management Component', () => {
  let comp: AmigosComponent;
  let fixture: ComponentFixture<AmigosComponent>;
  let service: AmigosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'amigos', component: AmigosComponent }]), HttpClientTestingModule],
      declarations: [AmigosComponent],
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
      .overrideTemplate(AmigosComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AmigosComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AmigosService);

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
    expect(comp.amigos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to amigosService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAmigosIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAmigosIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
