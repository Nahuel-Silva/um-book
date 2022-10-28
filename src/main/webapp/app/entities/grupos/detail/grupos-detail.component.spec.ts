import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GruposDetailComponent } from './grupos-detail.component';

describe('Grupos Management Detail Component', () => {
  let comp: GruposDetailComponent;
  let fixture: ComponentFixture<GruposDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GruposDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grupos: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GruposDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GruposDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grupos on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grupos).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
