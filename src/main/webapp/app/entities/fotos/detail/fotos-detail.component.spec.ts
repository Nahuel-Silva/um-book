import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FotosDetailComponent } from './fotos-detail.component';

describe('Fotos Management Detail Component', () => {
  let comp: FotosDetailComponent;
  let fixture: ComponentFixture<FotosDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FotosDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ fotos: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FotosDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FotosDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load fotos on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.fotos).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
