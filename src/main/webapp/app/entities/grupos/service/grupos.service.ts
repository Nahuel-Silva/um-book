import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrupos, NewGrupos } from '../grupos.model';

export type PartialUpdateGrupos = Partial<IGrupos> & Pick<IGrupos, 'id'>;

export type EntityResponseType = HttpResponse<IGrupos>;
export type EntityArrayResponseType = HttpResponse<IGrupos[]>;

@Injectable({ providedIn: 'root' })
export class GruposService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grupos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grupos: NewGrupos): Observable<EntityResponseType> {
    return this.http.post<IGrupos>(this.resourceUrl, grupos, { observe: 'response' });
  }

  update(grupos: IGrupos): Observable<EntityResponseType> {
    return this.http.put<IGrupos>(`${this.resourceUrl}/${this.getGruposIdentifier(grupos)}`, grupos, { observe: 'response' });
  }

  partialUpdate(grupos: PartialUpdateGrupos): Observable<EntityResponseType> {
    return this.http.patch<IGrupos>(`${this.resourceUrl}/${this.getGruposIdentifier(grupos)}`, grupos, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrupos>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrupos[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGruposIdentifier(grupos: Pick<IGrupos, 'id'>): number {
    return grupos.id;
  }

  compareGrupos(o1: Pick<IGrupos, 'id'> | null, o2: Pick<IGrupos, 'id'> | null): boolean {
    return o1 && o2 ? this.getGruposIdentifier(o1) === this.getGruposIdentifier(o2) : o1 === o2;
  }

  addGruposToCollectionIfMissing<Type extends Pick<IGrupos, 'id'>>(
    gruposCollection: Type[],
    ...gruposToCheck: (Type | null | undefined)[]
  ): Type[] {
    const grupos: Type[] = gruposToCheck.filter(isPresent);
    if (grupos.length > 0) {
      const gruposCollectionIdentifiers = gruposCollection.map(gruposItem => this.getGruposIdentifier(gruposItem)!);
      const gruposToAdd = grupos.filter(gruposItem => {
        const gruposIdentifier = this.getGruposIdentifier(gruposItem);
        if (gruposCollectionIdentifiers.includes(gruposIdentifier)) {
          return false;
        }
        gruposCollectionIdentifiers.push(gruposIdentifier);
        return true;
      });
      return [...gruposToAdd, ...gruposCollection];
    }
    return gruposCollection;
  }
}
