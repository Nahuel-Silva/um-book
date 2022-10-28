import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPerfil, NewPerfil } from '../perfil.model';

export type PartialUpdatePerfil = Partial<IPerfil> & Pick<IPerfil, 'id'>;

export type EntityResponseType = HttpResponse<IPerfil>;
export type EntityArrayResponseType = HttpResponse<IPerfil[]>;

@Injectable({ providedIn: 'root' })
export class PerfilService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/perfils');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(perfil: NewPerfil): Observable<EntityResponseType> {
    return this.http.post<IPerfil>(this.resourceUrl, perfil, { observe: 'response' });
  }

  update(perfil: IPerfil): Observable<EntityResponseType> {
    return this.http.put<IPerfil>(`${this.resourceUrl}/${this.getPerfilIdentifier(perfil)}`, perfil, { observe: 'response' });
  }

  partialUpdate(perfil: PartialUpdatePerfil): Observable<EntityResponseType> {
    return this.http.patch<IPerfil>(`${this.resourceUrl}/${this.getPerfilIdentifier(perfil)}`, perfil, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPerfil>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPerfil[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPerfilIdentifier(perfil: Pick<IPerfil, 'id'>): number {
    return perfil.id;
  }

  comparePerfil(o1: Pick<IPerfil, 'id'> | null, o2: Pick<IPerfil, 'id'> | null): boolean {
    return o1 && o2 ? this.getPerfilIdentifier(o1) === this.getPerfilIdentifier(o2) : o1 === o2;
  }

  addPerfilToCollectionIfMissing<Type extends Pick<IPerfil, 'id'>>(
    perfilCollection: Type[],
    ...perfilsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const perfils: Type[] = perfilsToCheck.filter(isPresent);
    if (perfils.length > 0) {
      const perfilCollectionIdentifiers = perfilCollection.map(perfilItem => this.getPerfilIdentifier(perfilItem)!);
      const perfilsToAdd = perfils.filter(perfilItem => {
        const perfilIdentifier = this.getPerfilIdentifier(perfilItem);
        if (perfilCollectionIdentifiers.includes(perfilIdentifier)) {
          return false;
        }
        perfilCollectionIdentifiers.push(perfilIdentifier);
        return true;
      });
      return [...perfilsToAdd, ...perfilCollection];
    }
    return perfilCollection;
  }
}
