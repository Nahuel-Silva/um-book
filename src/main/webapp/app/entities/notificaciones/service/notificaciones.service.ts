import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INotificaciones, NewNotificaciones } from '../notificaciones.model';

export type PartialUpdateNotificaciones = Partial<INotificaciones> & Pick<INotificaciones, 'id'>;

export type EntityResponseType = HttpResponse<INotificaciones>;
export type EntityArrayResponseType = HttpResponse<INotificaciones[]>;

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/notificaciones');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(notificaciones: NewNotificaciones): Observable<EntityResponseType> {
    return this.http.post<INotificaciones>(this.resourceUrl, notificaciones, { observe: 'response' });
  }

  update(notificaciones: INotificaciones): Observable<EntityResponseType> {
    return this.http.put<INotificaciones>(`${this.resourceUrl}/${this.getNotificacionesIdentifier(notificaciones)}`, notificaciones, {
      observe: 'response',
    });
  }

  partialUpdate(notificaciones: PartialUpdateNotificaciones): Observable<EntityResponseType> {
    return this.http.patch<INotificaciones>(`${this.resourceUrl}/${this.getNotificacionesIdentifier(notificaciones)}`, notificaciones, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INotificaciones>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INotificaciones[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNotificacionesIdentifier(notificaciones: Pick<INotificaciones, 'id'>): number {
    return notificaciones.id;
  }

  compareNotificaciones(o1: Pick<INotificaciones, 'id'> | null, o2: Pick<INotificaciones, 'id'> | null): boolean {
    return o1 && o2 ? this.getNotificacionesIdentifier(o1) === this.getNotificacionesIdentifier(o2) : o1 === o2;
  }

  addNotificacionesToCollectionIfMissing<Type extends Pick<INotificaciones, 'id'>>(
    notificacionesCollection: Type[],
    ...notificacionesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const notificaciones: Type[] = notificacionesToCheck.filter(isPresent);
    if (notificaciones.length > 0) {
      const notificacionesCollectionIdentifiers = notificacionesCollection.map(
        notificacionesItem => this.getNotificacionesIdentifier(notificacionesItem)!
      );
      const notificacionesToAdd = notificaciones.filter(notificacionesItem => {
        const notificacionesIdentifier = this.getNotificacionesIdentifier(notificacionesItem);
        if (notificacionesCollectionIdentifiers.includes(notificacionesIdentifier)) {
          return false;
        }
        notificacionesCollectionIdentifiers.push(notificacionesIdentifier);
        return true;
      });
      return [...notificacionesToAdd, ...notificacionesCollection];
    }
    return notificacionesCollection;
  }
}
