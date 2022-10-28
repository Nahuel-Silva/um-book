import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComentarios, NewComentarios } from '../comentarios.model';

export type PartialUpdateComentarios = Partial<IComentarios> & Pick<IComentarios, 'id'>;

export type EntityResponseType = HttpResponse<IComentarios>;
export type EntityArrayResponseType = HttpResponse<IComentarios[]>;

@Injectable({ providedIn: 'root' })
export class ComentariosService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/comentarios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(comentarios: NewComentarios): Observable<EntityResponseType> {
    return this.http.post<IComentarios>(this.resourceUrl, comentarios, { observe: 'response' });
  }

  update(comentarios: IComentarios): Observable<EntityResponseType> {
    return this.http.put<IComentarios>(`${this.resourceUrl}/${this.getComentariosIdentifier(comentarios)}`, comentarios, {
      observe: 'response',
    });
  }

  partialUpdate(comentarios: PartialUpdateComentarios): Observable<EntityResponseType> {
    return this.http.patch<IComentarios>(`${this.resourceUrl}/${this.getComentariosIdentifier(comentarios)}`, comentarios, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IComentarios>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IComentarios[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getComentariosIdentifier(comentarios: Pick<IComentarios, 'id'>): number {
    return comentarios.id;
  }

  compareComentarios(o1: Pick<IComentarios, 'id'> | null, o2: Pick<IComentarios, 'id'> | null): boolean {
    return o1 && o2 ? this.getComentariosIdentifier(o1) === this.getComentariosIdentifier(o2) : o1 === o2;
  }

  addComentariosToCollectionIfMissing<Type extends Pick<IComentarios, 'id'>>(
    comentariosCollection: Type[],
    ...comentariosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const comentarios: Type[] = comentariosToCheck.filter(isPresent);
    if (comentarios.length > 0) {
      const comentariosCollectionIdentifiers = comentariosCollection.map(
        comentariosItem => this.getComentariosIdentifier(comentariosItem)!
      );
      const comentariosToAdd = comentarios.filter(comentariosItem => {
        const comentariosIdentifier = this.getComentariosIdentifier(comentariosItem);
        if (comentariosCollectionIdentifiers.includes(comentariosIdentifier)) {
          return false;
        }
        comentariosCollectionIdentifiers.push(comentariosIdentifier);
        return true;
      });
      return [...comentariosToAdd, ...comentariosCollection];
    }
    return comentariosCollection;
  }
}
