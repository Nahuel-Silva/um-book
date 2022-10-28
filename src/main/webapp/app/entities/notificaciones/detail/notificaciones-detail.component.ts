import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INotificaciones } from '../notificaciones.model';

@Component({
  selector: 'jhi-notificaciones-detail',
  templateUrl: './notificaciones-detail.component.html',
})
export class NotificacionesDetailComponent implements OnInit {
  notificaciones: INotificaciones | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notificaciones }) => {
      this.notificaciones = notificaciones;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
