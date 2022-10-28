import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IComentarios } from '../comentarios.model';

@Component({
  selector: 'jhi-comentarios-detail',
  templateUrl: './comentarios-detail.component.html',
})
export class ComentariosDetailComponent implements OnInit {
  comentarios: IComentarios | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comentarios }) => {
      this.comentarios = comentarios;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
