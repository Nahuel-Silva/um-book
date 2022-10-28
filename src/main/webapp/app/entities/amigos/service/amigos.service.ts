import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAmigos, NewAmigos } from '../amigos.model';

export type PartialUpdateAmigos = Partial<IAmigos> & Pick<IAmigos, 'id'>;

export type EntityResponseType = HttpResponse<IAmigos>;
export type EntityArrayResponseType = HttpResponse<IAmigos[]>;

@Injectable({ providedIn: 'root' })
export class AmigosService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/amigos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(amigos: NewAmigos): Observable<EntityResponseType> {
    return this.http.post<IAmigos>(this.resourceUrl, amigos, { observe: 'response' });
  }

  update(amigos: IAmigos): Observable<EntityResponseType> {
    return this.http.put<IAmigos>(`${this.resourceUrl}/${this.getAmigosIdentifier(amigos)}`, amigos, { observe: 'response' });
  }

  partialUpdate(amigos: PartialUpdateAmigos): Observable<EntityResponseType> {
    return this.http.patch<IAmigos>(`${this.resourceUrl}/${this.getAmigosIdentifier(amigos)}`, amigos, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAmigos>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAmigos[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAmigosIdentifier(amigos: Pick<IAmigos, 'id'>): number {
    return amigos.id;
  }

  compareAmigos(o1: Pick<IAmigos, 'id'> | null, o2: Pick<IAmigos, 'id'> | null): boolean {
    return o1 && o2 ? this.getAmigosIdentifier(o1) === this.getAmigosIdentifier(o2) : o1 === o2;
  }

  addAmigosToCollectionIfMissing<Type extends Pick<IAmigos, 'id'>>(
    amigosCollection: Type[],
    ...amigosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const amigos: Type[] = amigosToCheck.filter(isPresent);
    if (amigos.length > 0) {
      const amigosCollectionIdentifiers = amigosCollection.map(amigosItem => this.getAmigosIdentifier(amigosItem)!);
      const amigosToAdd = amigos.filter(amigosItem => {
        const amigosIdentifier = this.getAmigosIdentifier(amigosItem);
        if (amigosCollectionIdentifiers.includes(amigosIdentifier)) {
          return false;
        }
        amigosCollectionIdentifiers.push(amigosIdentifier);
        return true;
      });
      return [...amigosToAdd, ...amigosCollection];
    }
    return amigosCollection;
  }
}
