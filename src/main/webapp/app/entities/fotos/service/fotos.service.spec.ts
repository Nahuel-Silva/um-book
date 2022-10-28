import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFotos } from '../fotos.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../fotos.test-samples';

import { FotosService } from './fotos.service';

const requireRestSample: IFotos = {
  ...sampleWithRequiredData,
};

describe('Fotos Service', () => {
  let service: FotosService;
  let httpMock: HttpTestingController;
  let expectedResult: IFotos | IFotos[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FotosService);
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

    it('should create a Fotos', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fotos = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(fotos).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Fotos', () => {
      const fotos = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(fotos).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Fotos', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Fotos', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Fotos', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFotosToCollectionIfMissing', () => {
      it('should add a Fotos to an empty array', () => {
        const fotos: IFotos = sampleWithRequiredData;
        expectedResult = service.addFotosToCollectionIfMissing([], fotos);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fotos);
      });

      it('should not add a Fotos to an array that contains it', () => {
        const fotos: IFotos = sampleWithRequiredData;
        const fotosCollection: IFotos[] = [
          {
            ...fotos,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFotosToCollectionIfMissing(fotosCollection, fotos);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Fotos to an array that doesn't contain it", () => {
        const fotos: IFotos = sampleWithRequiredData;
        const fotosCollection: IFotos[] = [sampleWithPartialData];
        expectedResult = service.addFotosToCollectionIfMissing(fotosCollection, fotos);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fotos);
      });

      it('should add only unique Fotos to an array', () => {
        const fotosArray: IFotos[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const fotosCollection: IFotos[] = [sampleWithRequiredData];
        expectedResult = service.addFotosToCollectionIfMissing(fotosCollection, ...fotosArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fotos: IFotos = sampleWithRequiredData;
        const fotos2: IFotos = sampleWithPartialData;
        expectedResult = service.addFotosToCollectionIfMissing([], fotos, fotos2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fotos);
        expect(expectedResult).toContain(fotos2);
      });

      it('should accept null and undefined values', () => {
        const fotos: IFotos = sampleWithRequiredData;
        expectedResult = service.addFotosToCollectionIfMissing([], null, fotos, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fotos);
      });

      it('should return initial array if no Fotos is added', () => {
        const fotosCollection: IFotos[] = [sampleWithRequiredData];
        expectedResult = service.addFotosToCollectionIfMissing(fotosCollection, undefined, null);
        expect(expectedResult).toEqual(fotosCollection);
      });
    });

    describe('compareFotos', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFotos(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFotos(entity1, entity2);
        const compareResult2 = service.compareFotos(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFotos(entity1, entity2);
        const compareResult2 = service.compareFotos(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFotos(entity1, entity2);
        const compareResult2 = service.compareFotos(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
