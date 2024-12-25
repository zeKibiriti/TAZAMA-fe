import {Component, Inject, OnInit} from '@angular/core';
import {PermissionsService} from "../../permissions/permissions.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {RolesModel} from "../Roles.model";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../../shared/services/toast.service";
import {MapPermissionsModel} from "../Map-permissions.model";

@Component({
  selector: 'app-map-permissions',
  templateUrl: './map-permissions.component.html',
  styleUrls: ['./map-permissions.component.scss']
})
export class MapPermissionsComponent implements OnInit {
  header: string;
  isSaving = false;
  formError = false;
  editForm: FormGroup;
  permissions: any;
  isLoading = false; // Loader flag
  // name: string;
  // displayedColumns = ['no', 'code', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<RolesModel>();
  constructor(
      private fb: FormBuilder,
      private dialog: MatDialog,
      private toastService: ToastService,
      public permissionsService: PermissionsService,
      @Inject(MAT_DIALOG_DATA) private data: { header: string; role: RolesModel }
  ) { }

  ngOnInit(): void {
    this.loadData();
      this.updateForm(this.data.role);
      this.editForm = this.fb.group({
          id: [null],
          role_id: this.data.role.id,
          permission_id: ['', Validators.required],
      });
  }

    loadData() {
        this.isLoading = true; // Start loader
        this.permissionsService.getAll()?.subscribe(
            (response: any) => {
                if (response?.data) {
                    this.permissions = response.data; // Set data into stationStatuses
                    // console.log('PermissionData:', this.dataSource);
                } else {
                    console.error('No data found');
                }
                this.isLoading = false; // Stop loader
            },
            (error) => {
                console.error('Error loading Permissions:', error); // Error handling
                this.isLoading = false; // Stop loader
            }
        );
    }

    private updateForm(mapPermissionsModel: MapPermissionsModel): void {
        if (mapPermissionsModel) {
            this.editForm.patchValue({
                id: mapPermissionsModel.id,
                role_id: this.data.role.id,
                // role_id: mapPermissionsModel.role_id,
                permission_id: mapPermissionsModel.permission_id,
            });
        }
    }

    private createFromForm(): MapPermissionsModel {
        return {
            ...new MapPermissionsModel(),
            id: this.editForm.get('id')!.value,
            role_id: this.data.role.id,
            permission_id: this.editForm.get('permission_id')!.value,
        };
    }

    savePermissions(): void {
        console.log('Selected permissions:', this.editForm.value);
        // Handle saving permissions logic
    }

    cancel(): void {
        console.log('Cancel mapping permissions.');
        // Handle cancel logic
    }

}
