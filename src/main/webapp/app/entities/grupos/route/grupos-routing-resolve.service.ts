import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrupos } from '../grupos.model';
import { GruposService } from '../service/grupos.service';

@Injectable({ providedIn: 'root' })
export class GruposRoutingResolveService implements Resolve<IGrupos | null> {
  constructor(protected service: GruposService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrupos | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grupos: HttpResponse<IGrupos>) => {
          if (grupos.body) {
            return of(grupos.body);
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
