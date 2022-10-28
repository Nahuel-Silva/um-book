import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { NotificacionesService } from '../service/notificaciones.service';

import { NotificacionesComponent } from './notificaciones.component';

describe('Notificaciones Management Component', () => {
  let comp: NotificacionesComponent;
  let fixture: ComponentFixture<NotificacionesComponent>;
  let service: NotificacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'notificaciones', component: NotificacionesComponent }]), HttpClientTestingModule],
      declarations: [NotificacionesComponent],
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
      .overrideTemplate(NotificacionesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NotificacionesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NotificacionesService);

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
    expect(comp.notificaciones?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to notificacionesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getNotificacionesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getNotificacionesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
