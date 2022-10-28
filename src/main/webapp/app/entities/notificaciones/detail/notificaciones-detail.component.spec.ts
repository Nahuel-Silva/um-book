import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NotificacionesDetailComponent } from './notificaciones-detail.component';

describe('Notificaciones Management Detail Component', () => {
  let comp: NotificacionesDetailComponent;
  let fixture: ComponentFixture<NotificacionesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificacionesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ notificaciones: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NotificacionesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NotificacionesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load notificaciones on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.notificaciones).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
