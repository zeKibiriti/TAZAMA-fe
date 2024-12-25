import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {StationsModel} from '../stations/Stations.model';
import {AppSettings} from '../../app.settings';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ToastService} from '../../shared/services/toast.service';
import {ConfirmDialogComponent} from '../../utils/confirm-dialog/confirm-dialog.component';
import {StatusModel} from "./Station-status.model";
import {StatusFormComponent} from "./status-form/status-form.component";
import {StationStatusService} from "./station-status.service";
import {StationLogsFormComponent} from "../station-logs/station-logs-form/station-logs-form.component";

@Component({
  selector: 'app-station-status',
  templateUrl: './station-status.component.html',
  styleUrls: ['./station-status.component.scss']
})
export class StationStatusComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading = false; // Loader flag
  displayedColumns = ['no', 'code', 'name', 'description', 'actions'];
  settings = this.appSettings.settings;
  dataSource = new MatTableDataSource<StationsModel>();
  constructor(
      public appSettings: AppSettings,
      public dialog: MatDialog,
      private toastService: ToastService,
      public stationStatusService: StationStatusService,
      @Inject(MAT_DIALOG_DATA) public data: { header: string }
  ) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true; // Start loader
    this.stationStatusService.getAll()?.subscribe(
        (response: any) => {
          if (response?.data) {
            this.dataSource = response.data; // Set data into stationStatuses
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

  createOrUpdate(rowData?: StatusModel): void {
    console.log('DATA:', rowData);
    // If no rowData is provided, create a new empty StationsModel
    const data: StatusModel = rowData ?? new StatusModel();
    const dialogRef = this.dialog.open(StationLogsFormComponent, {
      width: '800px',
      data: {
        header: rowData ? 'Edit Station Status' : 'Add New Station Status',
        stationLogs: data, // Pass the station data here (either for editing or new)
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
            this.stationStatusService.delete(element.id).subscribe(
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
