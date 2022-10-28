import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IComentarios } from '../comentarios.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../comentarios.test-samples';

import { ComentariosService } from './comentarios.service';

const requireRestSample: IComentarios = {
  ...sampleWithRequiredData,
};

describe('Comentarios Service', () => {
  let service: ComentariosService;
  let httpMock: HttpTestingController;
  let expectedResult: IComentarios | IComentarios[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ComentariosService);
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

    it('should create a Comentarios', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const comentarios = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(comentarios).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Comentarios', () => {
      const comentarios = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(comentarios).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Comentarios', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Comentarios', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Comentarios', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addComentariosToCollectionIfMissing', () => {
      it('should add a Comentarios to an empty array', () => {
        const comentarios: IComentarios = sampleWithRequiredData;
        expectedResult = service.addComentariosToCollectionIfMissing([], comentarios);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(comentarios);
      });

      it('should not add a Comentarios to an array that contains it', () => {
        const comentarios: IComentarios = sampleWithRequiredData;
        const comentariosCollection: IComentarios[] = [
          {
            ...comentarios,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addComentariosToCollectionIfMissing(comentariosCollection, comentarios);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Comentarios to an array that doesn't contain it", () => {
        const comentarios: IComentarios = sampleWithRequiredData;
        const comentariosCollection: IComentarios[] = [sampleWithPartialData];
        expectedResult = service.addComentariosToCollectionIfMissing(comentariosCollection, comentarios);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(comentarios);
      });

      it('should add only unique Comentarios to an array', () => {
        const comentariosArray: IComentarios[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const comentariosCollection: IComentarios[] = [sampleWithRequiredData];
        expectedResult = service.addComentariosToCollectionIfMissing(comentariosCollection, ...comentariosArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const comentarios: IComentarios = sampleWithRequiredData;
        const comentarios2: IComentarios = sampleWithPartialData;
        expectedResult = service.addComentariosToCollectionIfMissing([], comentarios, comentarios2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(comentarios);
        expect(expectedResult).toContain(comentarios2);
      });

      it('should accept null and undefined values', () => {
        const comentarios: IComentarios = sampleWithRequiredData;
        expectedResult = service.addComentariosToCollectionIfMissing([], null, comentarios, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(comentarios);
      });

      it('should return initial array if no Comentarios is added', () => {
        const comentariosCollection: IComentarios[] = [sampleWithRequiredData];
        expectedResult = service.addComentariosToCollectionIfMissing(comentariosCollection, undefined, null);
        expect(expectedResult).toEqual(comentariosCollection);
      });
    });

    describe('compareComentarios', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareComentarios(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareComentarios(entity1, entity2);
        const compareResult2 = service.compareComentarios(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareComentarios(entity1, entity2);
        const compareResult2 = service.compareComentarios(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareComentarios(entity1, entity2);
        const compareResult2 = service.compareComentarios(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
