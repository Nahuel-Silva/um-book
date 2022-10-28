import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AdminService } from '../service/admin.service';

import { AdminComponent } from './admin.component';

describe('Admin Management Component', () => {
  let comp: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'admin', component: AdminComponent }]), HttpClientTestingModule],
      declarations: [AdminComponent],
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
      .overrideTemplate(AdminComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AdminService);

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
    expect(comp.admins?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to adminService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAdminIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAdminIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
