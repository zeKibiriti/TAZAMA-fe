import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../shared/services/toast.service';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../../utils/custome-responce';
import {finalize} from 'rxjs/operators';
import {StationStatusService} from '../station-status.service';
import {StatusModel} from '../Station-status.model';

@Component({
  selector: 'app-status-form',
  templateUrl: './status-form.component.html',
  styleUrls: ['./status-form.component.scss']
})
export class StatusFormComponent implements OnInit {

  header: string;
  isSaving = false;
  formError = false;
  editForm: FormGroup;
  isLoading = false; // Loader flag
  name: string;
  displayedColumns = ['no', 'code', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<StatusModel>();

  constructor(
      private fb: FormBuilder,
      private dialog: MatDialog,
      private toastService: ToastService,
      private stationsStatusService: StationStatusService,
      private dialogRef: MatDialogRef<StatusFormComponent>,
      @Inject(MAT_DIALOG_DATA) private data: { header: string; stationStatus: StatusModel }
  ) {}

  ngOnInit(): void {
    this.header = this.data.header; // Dialog header text
    this.initializeForm();
    this.updateForm(this.data.stationStatus); // Patch form with station data if provided
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
    });
  }

  private updateForm(statusModel: StatusModel): void {
    if (statusModel) {
      this.editForm.patchValue({
        id: statusModel.id,
        code: statusModel.code,
        name: statusModel.name,
        description: statusModel.description,
      });
    }
  }

  private createFromForm(): StatusModel {
    return {
      ...new StatusModel(),
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
    const stationStatus = this.createFromForm();
    const saveObservable = stationStatus.id
        ? this.stationsStatusService.update(stationStatus)
        : this.stationsStatusService.create(stationStatus);
    this.subscribeToSaveResponse(saveObservable);
  }

  private subscribeToSaveResponse(result: Observable<CustomResponse<StatusModel>>): void {
    result.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.onSaveSuccess(),
      error: (err) => this.onSaveError(err),
    });
  }

  private onSaveSuccess(): void {
    this.toastService.showSuccess('Station Status saved successfully!');
    this.dialogRef.close(true); // Close the dialog with success flag
    // this.loadData();
  }

  private onSaveError(error: any): void {
    console.error('Save error:', error);
    this.toastService.showError('Failed to save Station Status!');
  }

  clearField(code: string) {

  }

}
