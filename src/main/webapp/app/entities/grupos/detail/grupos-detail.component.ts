import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrupos } from '../grupos.model';

@Component({
  selector: 'jhi-grupos-detail',
  templateUrl: './grupos-detail.component.html',
})
export class GruposDetailComponent implements OnInit {
  grupos: IGrupos | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grupos }) => {
      this.grupos = grupos;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
