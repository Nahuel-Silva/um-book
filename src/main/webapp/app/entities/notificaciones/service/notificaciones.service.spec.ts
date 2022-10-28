import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INotificaciones } from '../notificaciones.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../notificaciones.test-samples';

import { NotificacionesService } from './notificaciones.service';

const requireRestSample: INotificaciones = {
  ...sampleWithRequiredData,
};

describe('Notificaciones Service', () => {
  let service: NotificacionesService;
  let httpMock: HttpTestingController;
  let expectedResult: INotificaciones | INotificaciones[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NotificacionesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Notificaciones', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const notificaciones = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(notificaciones).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Notificaciones', () => {
      const notificaciones = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(notificaciones).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Notificaciones', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Notificaciones', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Notificaciones', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNotificacionesToCollectionIfMissing', () => {
      it('should add a Notificaciones to an empty array', () => {
        const notificaciones: INotificaciones = sampleWithRequiredData;
        expectedResult = service.addNotificacionesToCollectionIfMissing([], notificaciones);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notificaciones);
      });

      it('should not add a Notificaciones to an array that contains it', () => {
        const notificaciones: INotificaciones = sampleWithRequiredData;
        const notificacionesCollection: INotificaciones[] = [
          {
            ...notificaciones,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNotificacionesToCollectionIfMissing(notificacionesCollection, notificaciones);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Notificaciones to an array that doesn't contain it", () => {
        const notificaciones: INotificaciones = sampleWithRequiredData;
        const notificacionesCollection: INotificaciones[] = [sampleWithPartialData];
        expectedResult = service.addNotificacionesToCollectionIfMissing(notificacionesCollection, notificaciones);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notificaciones);
      });

      it('should add only unique Notificaciones to an array', () => {
        const notificacionesArray: INotificaciones[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const notificacionesCollection: INotificaciones[] = [sampleWithRequiredData];
        expectedResult = service.addNotificacionesToCollectionIfMissing(notificacionesCollection, ...notificacionesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const notificaciones: INotificaciones = sampleWithRequiredData;
        const notificaciones2: INotificaciones = sampleWithPartialData;
        expectedResult = service.addNotificacionesToCollectionIfMissing([], notificaciones, notificaciones2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notificaciones);
        expect(expectedResult).toContain(notificaciones2);
      });

      it('should accept null and undefined values', () => {
        const notificaciones: INotificaciones = sampleWithRequiredData;
        expectedResult = service.addNotificacionesToCollectionIfMissing([], null, notificaciones, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notificaciones);
      });

      it('should return initial array if no Notificaciones is added', () => {
        const notificacionesCollection: INotificaciones[] = [sampleWithRequiredData];
        expectedResult = service.addNotificacionesToCollectionIfMissing(notificacionesCollection, undefined, null);
        expect(expectedResult).toEqual(notificacionesCollection);
      });
    });

    describe('compareNotificaciones', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNotificaciones(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareNotificaciones(entity1, entity2);
        const compareResult2 = service.compareNotificaciones(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareNotificaciones(entity1, entity2);
        const compareResult2 = service.compareNotificaciones(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareNotificaciones(entity1, entity2);
        const compareResult2 = service.compareNotificaciones(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
