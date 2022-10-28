import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAmigos } from '../amigos.model';

@Component({
  selector: 'jhi-amigos-detail',
  templateUrl: './amigos-detail.component.html',
})
export class AmigosDetailComponent implements OnInit {
  amigos: IAmigos | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ amigos }) => {
      this.amigos = amigos;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
