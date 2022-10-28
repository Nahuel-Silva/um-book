import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AmigosDetailComponent } from './amigos-detail.component';

describe('Amigos Management Detail Component', () => {
  let comp: AmigosDetailComponent;
  let fixture: ComponentFixture<AmigosDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmigosDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ amigos: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AmigosDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AmigosDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load amigos on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.amigos).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
