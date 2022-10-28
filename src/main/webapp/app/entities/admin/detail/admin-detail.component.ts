import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdmin } from '../admin.model';

@Component({
  selector: 'jhi-admin-detail',
  templateUrl: './admin-detail.component.html',
})
export class AdminDetailComponent implements OnInit {
  admin: IAdmin | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ admin }) => {
      this.admin = admin;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
