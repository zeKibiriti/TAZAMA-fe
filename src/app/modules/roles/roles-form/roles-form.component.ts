import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastService} from "../../../shared/services/toast.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custome-responce";
import {finalize} from "rxjs/operators";
import {RolesModel} from "../Roles.model";
import {RolesService} from "../roles.service";

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent implements OnInit {

  header: string;
  isSaving = false;
  formError = false;
  editForm: FormGroup;
  isLoading = false; // Loader flag
  name: string;
  displayedColumns = ['no', 'code', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<RolesModel>();

  constructor(
      private fb: FormBuilder,
      private dialog: MatDialog,
      private toastService: ToastService,
      private rolesService: RolesService,
      private dialogRef: MatDialogRef<RolesFormComponent>,
      @Inject(MAT_DIALOG_DATA) private data: { header: string; role: RolesModel }
  ) {}

  ngOnInit(): void {
    this.header = this.data.header; // Dialog header text
    this.initializeForm();
    this.updateForm(this.data.role); // Patch form with station data if provided
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
    });
  }

  private updateForm(rolesModel: RolesModel): void {
    if (rolesModel) {
      this.editForm.patchValue({
        id: rolesModel.id,
        code: rolesModel.code,
        name: rolesModel.name,
        description: rolesModel.description,
      });
    }
  }

  private createFromForm(): RolesModel {
    return {
      ...new RolesModel(),
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
    const role = this.createFromForm();
    const saveObservable = role.id
        ? this.rolesService.update(role)
        : this.rolesService.create(role);
    this.subscribeToSaveResponse(saveObservable);
  }

  private subscribeToSaveResponse(result: Observable<CustomResponse<RolesModel>>): void {
    result.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.onSaveSuccess(),
      error: (err) => this.onSaveError(err),
    });
  }

  private onSaveSuccess(): void {
    this.toastService.showSuccess('Role saved successfully!');
    this.dialogRef.close(true); // Close the dialog with success flag
    // this.loadData();
  }

  private onSaveError(error: any): void {
    console.error('Save error:', error);
    this.toastService.showError('Failed to save Role!');
  }

  clearField(formField: string) {
    const control = this.editForm.get(formField);
    if (control) {
      control.setValue(null); // Clear the field value
    }
  }

}
