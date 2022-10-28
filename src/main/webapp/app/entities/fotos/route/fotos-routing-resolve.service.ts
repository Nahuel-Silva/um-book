import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFotos } from '../fotos.model';
import { FotosService } from '../service/fotos.service';

@Injectable({ providedIn: 'root' })
export class FotosRoutingResolveService implements Resolve<IFotos | null> {
  constructor(protected service: FotosService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFotos | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fotos: HttpResponse<IFotos>) => {
          if (fotos.body) {
            return of(fotos.body);
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
