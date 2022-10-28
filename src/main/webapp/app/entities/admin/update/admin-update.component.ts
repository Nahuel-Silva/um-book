import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AdminFormService, AdminFormGroup } from './admin-form.service';
import { IAdmin } from '../admin.model';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'jhi-admin-update',
  templateUrl: './admin-update.component.html',
})
export class AdminUpdateComponent implements OnInit {
  isSaving = false;
  admin: IAdmin | null = null;

  editForm: AdminFormGroup = this.adminFormService.createAdminFormGroup();

  constructor(
    protected adminService: AdminService,
    protected adminFormService: AdminFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ admin }) => {
      this.admin = admin;
      if (admin) {
        this.updateForm(admin);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const admin = this.adminFormService.getAdmin(this.editForm);
    if (admin.id !== null) {
      this.subscribeToSaveResponse(this.adminService.update(admin));
    } else {
      this.subscribeToSaveResponse(this.adminService.create(admin));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdmin>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(admin: IAdmin): void {
    this.admin = admin;
    this.adminFormService.resetForm(this.editForm, admin);
  }
}
