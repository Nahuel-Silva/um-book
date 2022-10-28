import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPerfil } from '../perfil.model';
import { PerfilService } from '../service/perfil.service';

@Injectable({ providedIn: 'root' })
export class PerfilRoutingResolveService implements Resolve<IPerfil | null> {
  constructor(protected service: PerfilService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPerfil | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((perfil: HttpResponse<IPerfil>) => {
          if (perfil.body) {
            return of(perfil.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
