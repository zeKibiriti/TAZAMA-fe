import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {StationsModel} from "../../stations/Stations.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastService} from "../../../shared/services/toast.service";
import {StationsService} from "../../stations/stations.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custome-responce";
import {finalize} from "rxjs/operators";
import {UsersModel} from "../Users.model";
import {UsersService} from "../users.service";

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {

  header: string;
  isSaving = false;
  formError = false;
  editForm: FormGroup;
  isLoading = false; // Loader flag
  animal: string;
  name: string;
  displayedColumns = ['no', 'code', 'name', 'region_id', 'description', 'actions'];
  stations: any;
  dataSource = new MatTableDataSource<UsersModel>();

  constructor(
      private fb: FormBuilder,
      private dialog: MatDialog,
      private toastService: ToastService,
      private usersService: UsersService,
      private stationsService: StationsService,
      private dialogRef: MatDialogRef<UsersFormComponent>,
      @Inject(MAT_DIALOG_DATA) private data: { header: string; station: StationsModel }
  ) {}

  ngOnInit(): void {
    this.loadStationsData();
    this.header = this.data.header; // Dialog header text
    this.initializeForm();
    this.updateForm(this.data.station); // Patch form with station data if provided
  }

  loadStationsData() {
    this.isLoading = true; // Start loader
    this.stationsService.getAllStations()?.subscribe(
        (response: any) => {
          if (response) {
            this.stations = response; // Set data into stationStatuses
            console.log('StationsData:', this.dataSource);
          } else {
            console.error('No data found');
          }
          this.isLoading = false; // Stop loader
        },
        (error) => {
          console.error('Error loading stations:', error); // Error handling
          this.isLoading = false; // Stop loader
        }
    );
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      id: [null],
      first_name: ['', Validators.required],
      middle_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      station: ['', Validators.required],
    });
  }

  private updateForm(usersModel: UsersModel): void {
    if (usersModel) {
      this.editForm.patchValue({
        id: usersModel.id,
        first_name: usersModel.first_name,
        middle_name: usersModel.middle_name,
        last_name: usersModel.last_name,
        station: usersModel.station,
        email: usersModel.email,
        password: usersModel.password,
      });
    }
  }

  private createFromForm(): UsersModel {
    return {
      ...new UsersModel(),
      id: this.editForm.get('id')!.value,
      first_name: this.editForm.get('first_name')!.value,
      middle_name: this.editForm.get('middle_name')!.value,
      last_name: this.editForm.get('last_name')!.value,
      station: this.editForm.get('station')!.value,
      email: this.editForm.get('email')!.value,
      password: this.editForm.get('password')!.value,
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
    const user = this.createFromForm();
    const saveObservable = user.id
        ? this.usersService.update(user)
        : this.usersService.create(user);
    this.subscribeToSaveResponse(saveObservable);
  }

  private subscribeToSaveResponse(result: Observable<CustomResponse<UsersModel>>): void {
    result.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.onSaveSuccess(),
      error: (err) => this.onSaveError(err),
    });
  }

  private onSaveSuccess(): void {
    this.toastService.showSuccess('User saved successfully!');
    this.dialogRef.close(true); // Close the dialog with success flag
    // this.loadData();
  }

  private onSaveError(error: any): void {
    console.error('Save error:', error);
    this.toastService.showError('Failed to save User!');
  }

  clearField(formField: string) {
    const control = this.editForm.get(formField);
    if (control) {
      control.setValue(null); // Clear the field value
    }
  }

}
