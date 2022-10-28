import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFotos } from '../fotos.model';

@Component({
  selector: 'jhi-fotos-detail',
  templateUrl: './fotos-detail.component.html',
})
export class FotosDetailComponent implements OnInit {
  fotos: IFotos | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fotos }) => {
      this.fotos = fotos;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
