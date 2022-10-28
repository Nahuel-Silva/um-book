import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPerfil } from '../perfil.model';

@Component({
  selector: 'jhi-perfil-detail',
  templateUrl: './perfil-detail.component.html',
})
export class PerfilDetailComponent implements OnInit {
  perfil: IPerfil | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ perfil }) => {
      this.perfil = perfil;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
