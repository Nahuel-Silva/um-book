import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFotos, NewFotos } from '../fotos.model';

export type PartialUpdateFotos = Partial<IFotos> & Pick<IFotos, 'id'>;

export type EntityResponseType = HttpResponse<IFotos>;
export type EntityArrayResponseType = HttpResponse<IFotos[]>;

@Injectable({ providedIn: 'root' })
export class FotosService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fotos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fotos: NewFotos): Observable<EntityResponseType> {
    return this.http.post<IFotos>(this.resourceUrl, fotos, { observe: 'response' });
  }

  update(fotos: IFotos): Observable<EntityResponseType> {
    return this.http.put<IFotos>(`${this.resourceUrl}/${this.getFotosIdentifier(fotos)}`, fotos, { observe: 'response' });
  }

  partialUpdate(fotos: PartialUpdateFotos): Observable<EntityResponseType> {
    return this.http.patch<IFotos>(`${this.resourceUrl}/${this.getFotosIdentifier(fotos)}`, fotos, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFotos>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFotos[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFotosIdentifier(fotos: Pick<IFotos, 'id'>): number {
    return fotos.id;
  }

  compareFotos(o1: Pick<IFotos, 'id'> | null, o2: Pick<IFotos, 'id'> | null): boolean {
    return o1 && o2 ? this.getFotosIdentifier(o1) === this.getFotosIdentifier(o2) : o1 === o2;
  }

  addFotosToCollectionIfMissing<Type extends Pick<IFotos, 'id'>>(
    fotosCollection: Type[],
    ...fotosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const fotos: Type[] = fotosToCheck.filter(isPresent);
    if (fotos.length > 0) {
      const fotosCollectionIdentifiers = fotosCollection.map(fotosItem => this.getFotosIdentifier(fotosItem)!);
      const fotosToAdd = fotos.filter(fotosItem => {
        const fotosIdentifier = this.getFotosIdentifier(fotosItem);
        if (fotosCollectionIdentifiers.includes(fotosIdentifier)) {
          return false;
        }
        fotosCollectionIdentifiers.push(fotosIdentifier);
        return true;
      });
      return [...fotosToAdd, ...fotosCollection];
    }
    return fotosCollection;
  }
}
