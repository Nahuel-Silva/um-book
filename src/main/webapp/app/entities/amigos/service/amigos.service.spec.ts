import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAmigos } from '../amigos.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../amigos.test-samples';

import { AmigosService } from './amigos.service';

const requireRestSample: IAmigos = {
  ...sampleWithRequiredData,
};

describe('Amigos Service', () => {
  let service: AmigosService;
  let httpMock: HttpTestingController;
  let expectedResult: IAmigos | IAmigos[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AmigosService);
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

    it('should create a Amigos', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const amigos = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(amigos).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Amigos', () => {
      const amigos = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(amigos).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Amigos', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Amigos', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Amigos', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAmigosToCollectionIfMissing', () => {
      it('should add a Amigos to an empty array', () => {
        const amigos: IAmigos = sampleWithRequiredData;
        expectedResult = service.addAmigosToCollectionIfMissing([], amigos);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(amigos);
      });

      it('should not add a Amigos to an array that contains it', () => {
        const amigos: IAmigos = sampleWithRequiredData;
        const amigosCollection: IAmigos[] = [
          {
            ...amigos,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAmigosToCollectionIfMissing(amigosCollection, amigos);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Amigos to an array that doesn't contain it", () => {
        const amigos: IAmigos = sampleWithRequiredData;
        const amigosCollection: IAmigos[] = [sampleWithPartialData];
        expectedResult = service.addAmigosToCollectionIfMissing(amigosCollection, amigos);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(amigos);
      });

      it('should add only unique Amigos to an array', () => {
        const amigosArray: IAmigos[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const amigosCollection: IAmigos[] = [sampleWithRequiredData];
        expectedResult = service.addAmigosToCollectionIfMissing(amigosCollection, ...amigosArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const amigos: IAmigos = sampleWithRequiredData;
        const amigos2: IAmigos = sampleWithPartialData;
        expectedResult = service.addAmigosToCollectionIfMissing([], amigos, amigos2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(amigos);
        expect(expectedResult).toContain(amigos2);
      });

      it('should accept null and undefined values', () => {
        const amigos: IAmigos = sampleWithRequiredData;
        expectedResult = service.addAmigosToCollectionIfMissing([], null, amigos, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(amigos);
      });

      it('should return initial array if no Amigos is added', () => {
        const amigosCollection: IAmigos[] = [sampleWithRequiredData];
        expectedResult = service.addAmigosToCollectionIfMissing(amigosCollection, undefined, null);
        expect(expectedResult).toEqual(amigosCollection);
      });
    });

    describe('compareAmigos', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAmigos(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAmigos(entity1, entity2);
        const compareResult2 = service.compareAmigos(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAmigos(entity1, entity2);
        const compareResult2 = service.compareAmigos(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAmigos(entity1, entity2);
        const compareResult2 = service.compareAmigos(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
