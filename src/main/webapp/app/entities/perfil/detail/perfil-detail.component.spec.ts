import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PerfilDetailComponent } from './perfil-detail.component';

describe('Perfil Management Detail Component', () => {
  let comp: PerfilDetailComponent;
  let fixture: ComponentFixture<PerfilDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ perfil: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PerfilDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PerfilDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load perfil on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.perfil).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
