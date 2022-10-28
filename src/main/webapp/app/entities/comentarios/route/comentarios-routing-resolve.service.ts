import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IComentarios } from '../comentarios.model';
import { ComentariosService } from '../service/comentarios.service';

@Injectable({ providedIn: 'root' })
export class ComentariosRoutingResolveService implements Resolve<IComentarios | null> {
  constructor(protected service: ComentariosService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IComentarios | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((comentarios: HttpResponse<IComentarios>) => {
          if (comentarios.body) {
            return of(comentarios.body);
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
