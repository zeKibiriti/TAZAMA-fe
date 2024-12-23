import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {StationsModel} from "../stations/Stations.model";
import {AppSettings} from "../../app.settings";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../shared/services/toast.service";
import {StationsService} from "../stations/stations.service";
import {StationUpdateComponent} from "../stations/station-update/station-update.component";
import {ConfirmDialogComponent} from "../../utils/confirm-dialog/confirm-dialog.component";
import {UsersModel} from "./Users.model";
import {MatPaginator} from "@angular/material/paginator";
import {UsersFormComponent} from "./users-form/users-form.component";
import {UsersService} from "./users.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading = false; // Loader flag
  displayedColumns = ['no', 'first_name', 'last_name', 'email', 'station', 'actions'];
  settings = this.appSettings.settings;
  dataSource = new MatTableDataSource<UsersModel>();
  constructor(
      public appSettings: AppSettings,
      public dialog: MatDialog,
      private toastService: ToastService,
      public usersService: UsersService,
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
    this.usersService.getAll()?.subscribe(
        (response: any) => {
          if (response) {
            this.dataSource = response.data; // Set data into stationStatuses
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

  createOrUpdate(rowData?: UsersModel): void {
    console.log('DATA:', rowData);
    // If no rowData is provided, create a new empty StationsModel
    const data: UsersModel = rowData ?? new UsersModel();
    const dialogRef = this.dialog.open(UsersFormComponent, {
      width: '800px',
      data: {
        header: rowData ? 'Edit User' : 'Add New User',
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
          data: { message: `Are you sure you want to delete ${element.last_name}?` },
        })
        .afterClosed()
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.usersService.delete(element.id).subscribe(
                () => {
                  this.toastService.showSuccess('User deleted successfully!');
                  this.loadData();
                },
                (error) => {
                  this.toastService.showError('Failed to delete the User.');
                  this.loadData();
                  console.error('Deletion error:', error);
                }
            );
          }
        });
  }

}
