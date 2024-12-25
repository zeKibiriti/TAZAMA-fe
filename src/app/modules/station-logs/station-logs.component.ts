import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {StationLogService} from "./station-log.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../utils/confirm-dialog/confirm-dialog.component";
import {ToastService} from "../../shared/services/toast.service";
import {StationLogsFormComponent} from "./station-logs-form/station-logs-form.component";
import {StationLogModel} from "./Station-Log.model";

@Component({
  selector: 'app-station-logs',
  templateUrl: './station-logs.component.html',
  styleUrls: ['./station-logs.component.scss']
})
export class StationLogsComponent implements OnInit {

  stationLogData: any[] = [];  // Define the type for stationStatuses
  displayedColumns: string[] = ['no', 'date', 'station_status_id', 'inletPressure',
    'outletPressure', 'averageFlowRate', 'operatingUnits', 'unitsOnStandby',
    'unitsOnMaintenance', 'powerSource', 'tankOnDelivery', 'pumpOver24Hrs',
    'pumpingDaysRemainingT4', 'operator_id', 'shift_leader_id', 'remarks', 'actions'];  // Column headers for the table

  constructor(
      private fb: FormBuilder,
      public dialog: MatDialog,
      private toastService: ToastService,
      public stationLogService: StationLogService,  // Inject the StationStatusService
  ) {}

  ngOnInit(): void {
    this.loadData();  // Load data when the component initializes
  }

  loadData() {
    // Assuming your service's getAll() method returns an observable with a 'data' property
    this.stationLogService.getAll()?.subscribe(
        (response: any) => {
          if (response) {
            this.stationLogData = response; // Set data into stationStatuses
            console.log('StationLogData:', response);
          } else {
            console.error('No data found');
          }
        },
        (error) => {
          console.error('Error loading station log:', error); // Error handling
        }
    );
  }

  createOrUpdate(rowData?: StationLogModel): void {
    console.log('DATA:', rowData);
    // If no rowData is provided, create a new empty StationsModel
    const data: StationLogModel = rowData ?? new StationLogModel();
    const dialogRef = this.dialog.open(StationLogsFormComponent, {
      width: '800px',
      data: {
        header: rowData ? 'Edit Station Log' : 'Add New Station Log',
        stationLog: data, // Pass the station data here (either for editing or new)
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog result:', result);
        this.loadData();
        // this.loadData(this.per_page, this.size);
      }
    });
  }

  onDelete(element: any): void {
    this.dialog
        .open(ConfirmDialogComponent, {
          width: '400px',
          data: { message: `Are you sure you want to delete ${element.name}?` },
        })
        .afterClosed()
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.stationLogService.delete(element.id).subscribe(
                () => {
                  this.toastService.showSuccess('Station deleted successfully!');
                  this.loadData();
                },
                (error) => {
                  this.toastService.showError('Failed to delete the station.');
                  this.loadData();
                  console.error('Deletion error:', error);
                }
            );
          }
        });
  }
}
