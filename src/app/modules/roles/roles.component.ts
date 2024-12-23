import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {StationsModel} from "../stations/Stations.model";
import {AppSettings} from "../../app.settings";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../shared/services/toast.service";
import {StationStatusService} from "../station-status/station-status.service";
import {StatusModel} from "../station-status/Station-status.model";
import {StatusFormComponent} from "../station-status/status-form/status-form.component";
import {ConfirmDialogComponent} from "../../utils/confirm-dialog/confirm-dialog.component";
import {RolesModel} from "./Roles.model";
import {RolesFormComponent} from "./roles-form/roles-form.component";
import {RolesService} from "./roles.service";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading = false; // Loader flag
  displayedColumns = ['no', 'code', 'name', 'description', 'actions'];
  settings = this.appSettings.settings;
  dataSource = new MatTableDataSource<StationsModel>();
  constructor(
      public appSettings: AppSettings,
      public dialog: MatDialog,
      private toastService: ToastService,
      public rolesService: RolesService,
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
    this.rolesService.getAll()?.subscribe(
        (response: any) => {
          if (response?.data) {
            this.dataSource = response.data; // Set data into stationStatuses
            console.log('RolesData:', this.dataSource);
          } else {
            console.error('No data found');
          }
          this.isLoading = false; // Stop loader
        },
        (error) => {
          console.error('Error loading roles:', error); // Error handling
          this.isLoading = false; // Stop loader
        }
    );
  }

  createOrUpdate(rowData?: RolesModel): void {
    console.log('DATA:', rowData);
    // If no rowData is provided, create a new empty StationsModel
    const data: RolesModel = rowData ?? new RolesModel();
    const dialogRef = this.dialog.open(RolesFormComponent, {
      width: '800px',
      data: {
        header: rowData ? 'Edit Roles' : 'Add New Role',
          role: data, // Pass the station data here (either for editing or new)
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
            this.rolesService.delete(element.id).subscribe(
                () => {
                  this.toastService.showSuccess('Role deleted successfully!');
                  this.loadData();
                },
                (error) => {
                  this.toastService.showError('Failed to delete the Role.');
                  this.loadData();
                  console.error('Deletion error:', error);
                }
            );
          }
        });
  }

}
