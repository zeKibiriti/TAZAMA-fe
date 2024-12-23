import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {AppSettings} from '../../app.settings';
import {MatTableDataSource} from '@angular/material/table';
import {StationsService} from './stations.service';
import {StationsModel} from './Stations.model';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {StationUpdateComponent} from './station-update/station-update.component';
import {ConfirmDialogComponent} from '../../utils/confirm-dialog/confirm-dialog.component';
import {ToastService} from '../../shared/services/toast.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss'],
})
export class StationsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading = false; // Loader flag
  displayedColumns = ['no', 'code', 'name', 'region', 'description', 'actions'];
  settings = this.appSettings.settings;
  dataSource = new MatTableDataSource<StationsModel>();
  constructor(
      public appSettings: AppSettings,
      public dialog: MatDialog,
      private toastService: ToastService,
      public stationsService: StationsService,
      @Inject(MAT_DIALOG_DATA) public data: { header: string }
  ) {
  }

    // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true; // Start loader
    this.stationsService.getAll()?.subscribe(
        (response: any) => {
          if (response) {
            this.dataSource = response; // Set data into stationStatuses
            console.log('StationData:', this.dataSource);
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

  createOrUpdate(rowData?: StationsModel): void {
    console.log('DATA:', rowData);
    // If no rowData is provided, create a new empty StationsModel
    const data: StationsModel = rowData ?? new StationsModel();
    const dialogRef = this.dialog.open(StationUpdateComponent, {
      width: '800px',
      data: {
        header: rowData ? 'Edit Station' : 'Add New Station',
        station: data, // Pass the station data here (either for editing or new)
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
            this.stationsService.delete(element.id).subscribe(
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
