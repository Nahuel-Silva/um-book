import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdminDetailComponent } from './admin-detail.component';

describe('Admin Management Detail Component', () => {
  let comp: AdminDetailComponent;
  let fixture: ComponentFixture<AdminDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ admin: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AdminDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdminDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load admin on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.admin).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
