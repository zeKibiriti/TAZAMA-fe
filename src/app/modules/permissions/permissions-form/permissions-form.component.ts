import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastService} from "../../../shared/services/toast.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custome-responce";
import {finalize} from "rxjs/operators";
import {PermissionsModel} from "../Permissions.model";
import {PermissionsService} from "../permissions.service";

@Component({
  selector: 'app-permissions-form',
  templateUrl: './permissions-form.component.html',
  styleUrls: ['./permissions-form.component.scss']
})
export class PermissionsFormComponent implements OnInit {

  header: string;
  isSaving = false;
  formError = false;
  editForm: FormGroup;
  isLoading = false; // Loader flag
  name: string;
  displayedColumns = ['no', 'code', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<PermissionsModel>();

  constructor(
      private fb: FormBuilder,
      private dialog: MatDialog,
      private toastService: ToastService,
      private permissionsService: PermissionsService,
      private dialogRef: MatDialogRef<PermissionsFormComponent>,
      @Inject(MAT_DIALOG_DATA) private data: { header: string; permission: PermissionsModel }
  ) {}

  ngOnInit(): void {
    this.header = this.data.header; // Dialog header text
    this.initializeForm();
    this.updateForm(this.data.permission); // Patch form with station data if provided
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
    });
  }

  private updateForm(permissionsModel: PermissionsModel): void {
    if (permissionsModel) {
      this.editForm.patchValue({
        id: permissionsModel.id,
        code: permissionsModel.code,
        name: permissionsModel.name,
        description: permissionsModel.description,
      });
    }
  }

  private createFromForm(): PermissionsModel {
    return {
      ...new PermissionsModel(),
      id: this.editForm.get('id')!.value,
      code: this.editForm.get('code')!.value,
      name: this.editForm.get('name')!.value,
      description: this.editForm.get('description')!.value,
    };
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog
  }

  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const permission = this.createFromForm();
    const saveObservable = permission.id
        ? this.permissionsService.update(permission)
        : this.permissionsService.create(permission);
    this.subscribeToSaveResponse(saveObservable);
  }

  private subscribeToSaveResponse(result: Observable<CustomResponse<PermissionsModel>>): void {
    result.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.onSaveSuccess(),
      error: (err) => this.onSaveError(err),
    });
  }

  private onSaveSuccess(): void {
    this.toastService.showSuccess('Permission saved successfully!');
    this.dialogRef.close(true); // Close the dialog with success flag
    // this.loadData();
  }

  private onSaveError(error: any): void {
    console.error('Save error:', error);
    this.toastService.showError('Failed to save Permission!');
  }

  clearField(formField: string) {
    const control = this.editForm.get(formField);
    if (control) {
      control.setValue(null); // Clear the field value
    }
  }

}
