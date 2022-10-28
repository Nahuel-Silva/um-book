import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ComentariosDetailComponent } from './comentarios-detail.component';

describe('Comentarios Management Detail Component', () => {
  let comp: ComentariosDetailComponent;
  let fixture: ComponentFixture<ComentariosDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComentariosDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ comentarios: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ComentariosDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ComentariosDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load comentarios on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.comentarios).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
