import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INotificaciones } from '../notificaciones.model';
import { NotificacionesService } from '../service/notificaciones.service';

@Injectable({ providedIn: 'root' })
export class NotificacionesRoutingResolveService implements Resolve<INotificaciones | null> {
  constructor(protected service: NotificacionesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INotificaciones | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((notificaciones: HttpResponse<INotificaciones>) => {
          if (notificaciones.body) {
            return of(notificaciones.body);
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
