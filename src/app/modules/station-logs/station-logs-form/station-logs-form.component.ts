import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {StatusModel} from "../../station-status/Station-status.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastService} from "../../../shared/services/toast.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custome-responce";
import {finalize} from "rxjs/operators";
import {StationLogModel} from "../Station-Log.model";
import {StationLogService} from "../station-log.service";
import {UsersService} from "../../users/users.service";
import {StationStatusService} from "../../station-status/station-status.service";

@Component({
  selector: 'app-station-logs-form',
  templateUrl: './station-logs-form.component.html',
  styleUrls: ['./station-logs-form.component.scss']
})
export class StationLogsFormComponent implements OnInit {

  header: string;
  isSaving = false;
  formError = false;
  editForm: FormGroup;
  isLoading = false; // Loader flag
  users: any;
  stationStatus: any;
  displayedColumns = ['no', 'code', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<StationLogModel>();

  constructor(
      private fb: FormBuilder,
      private dialog: MatDialog,
      private toastService: ToastService,
      private usersService: UsersService,
      private stationLogService: StationLogService,
      private stationStatusService: StationStatusService,
      private dialogRef: MatDialogRef<StationLogsFormComponent>,
      @Inject(MAT_DIALOG_DATA) private data: { header: string; stationStatus: StatusModel }
  ) {}

  ngOnInit(): void {
    this.loadStatus()
    this.loadUsers()
    this.header = this.data.header; // Dialog header text
    this.initializeForm();
    this.updateForm(this.data.stationStatus); // Patch form with station data if provided
  }

  loadStatus() {
    this.isLoading = true; // Start loader
    this.stationStatusService.getAll()?.subscribe(
        (response: any) => {
          if (response?.data) {
            this.stationStatus = response.data; // Set data into stationStatuses
            console.log('StatusData:', this.dataSource);
          } else {
            console.error('No data found');
          }
          this.isLoading = false; // Stop loader
        },
        (error) => {
          console.error('Error loading station statuses:', error); // Error handling
          this.isLoading = false; // Stop loader
        }
    );
  }

  loadUsers() {
    this.isLoading = true; // Start loader
    this.usersService.getAll()?.subscribe(
        (response: any) => {
          if (response) {
            this.users = response.data; // Set data into stationStatuses
            console.log('UsersData:', this.dataSource);
          } else {
            console.error('No data found');
          }
          this.isLoading = false; // Stop loader
        },
        (error) => {
          console.error('Error loading users:', error); // Error handling
          this.isLoading = false; // Stop loader
        }
    );
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      id: [null],
      date: ['', Validators.required],
      station_status_id: ['', Validators.required],
      inletPressure: ['', Validators.required],
      outletPressure: ['', Validators.required],
      averageFlowRate: ['', Validators.required],
      operatingUnits: ['', Validators.required],
      unitsOnStandby: ['', Validators.required],
      unitsOnMaintenance: ['', Validators.required],
      powerSource: ['', Validators.required],
      tankOnDelivery: ['', Validators.required],
      pumpOver24Hrs: ['', Validators.required],
      pumpingDaysRemainingT4: ['', Validators.required],
      operator_id: ['', Validators.required],
      shift_leader_id: ['', Validators.required],
      remarks: ['', Validators.required],
    });
  }

  private updateForm(stationLogModel: StationLogModel): void {
    if (stationLogModel) {
      this.editForm.patchValue({
        id: stationLogModel.id,
        date: stationLogModel.date,
        station_status_id: stationLogModel.station_status_id,
        inletPressure: stationLogModel.inletPressure,
        outletPressure: stationLogModel.outletPressure,
        averageFlowRate: stationLogModel.averageFlowRate,
        operatingUnits: stationLogModel.operatingUnits,
        unitsOnStandby: stationLogModel.unitsOnStandby,
        unitsOnMaintenance: stationLogModel.unitsOnMaintenance,
        powerSource: stationLogModel.powerSource,
        tankOnDelivery: stationLogModel.tankOnDelivery,
        pumpOver24Hrs: stationLogModel.pumpOver24Hrs,
        pumpingDaysRemainingT4: stationLogModel.pumpingDaysRemainingT4,
        operator_id: stationLogModel.operator_id,
        shift_leader_id: stationLogModel.shift_leader_id,
        remarks: stationLogModel.remarks,
      });
    }
  }

  private createFromForm(): StationLogModel {
    return {
      ...new StationLogModel(),
      id: this.editForm.get('id')!.value,
      date: this.editForm.get('date')!.value,
      station_status_id: this.editForm.get('station_status_id')!.value,
      inletPressure: this.editForm.get('inletPressure')!.value,
      outletPressure: this.editForm.get('outletPressure')!.value,
      averageFlowRate: this.editForm.get('averageFlowRate')!.value,
      operatingUnits: this.editForm.get('operatingUnits')!.value,
      unitsOnStandby: this.editForm.get('unitsOnStandby')!.value,
      unitsOnMaintenance: this.editForm.get('unitsOnMaintenance')!.value,
      powerSource: this.editForm.get('powerSource')!.value,
      tankOnDelivery: this.editForm.get('tankOnDelivery')!.value,
      pumpOver24Hrs: this.editForm.get('pumpOver24Hrs')!.value,
      pumpingDaysRemainingT4: this.editForm.get('pumpingDaysRemainingT4')!.value,
      operator_id: this.editForm.get('operator_id')!.value,
      shift_leader_id: this.editForm.get('shift_leader_id')!.value,
      remarks: this.editForm.get('remarks')!.value,
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
    const stationLog = this.createFromForm();
    const saveObservable = stationLog.id
        ? this.stationLogService.update(stationLog)
        : this.stationLogService.create(stationLog);
    this.subscribeToSaveResponse(saveObservable);
  }

  private subscribeToSaveResponse(result: Observable<CustomResponse<StationLogModel>>): void {
    result.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.onSaveSuccess(),
      error: (err) => this.onSaveError(err),
    });
  }

  private onSaveSuccess(): void {
    this.toastService.showSuccess('Station Log saved successfully!');
    this.dialogRef.close(true); // Close the dialog with success flag
    // this.loadData();
  }

  private onSaveError(error: any): void {
    console.error('Save error:', error);
    this.toastService.showError('Failed to save Station Log!');
  }

  clearField(formField: string) {
    const control = this.editForm.get(formField);
    if (control) {
      control.setValue(null); // Clear the field value
    }
  }

}
