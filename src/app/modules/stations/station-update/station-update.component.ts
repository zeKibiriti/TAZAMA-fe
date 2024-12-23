import { Component, Inject, OnInit } from '@angular/core';
import { StationsModel } from '../Stations.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StationsService } from '../stations.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CustomResponse } from '../../../utils/custome-responce';
import { ToastService } from '../../../shared/services/toast.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'app-station-update',
    templateUrl: './station-update.component.html',
    styleUrls: ['./station-update.component.scss'],
})
export class StationUpdateComponent implements OnInit {
    header: string;
    isSaving = false;
    formError = false;
    editForm: FormGroup;
    isLoading = false; // Loader flag
    animal: string;
    name: string;
    displayedColumns = ['no', 'code', 'name', 'region_id', 'description', 'actions'];
    regions: any;
    dataSource = new MatTableDataSource<StationsModel>();

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private toastService: ToastService,
        private stationsService: StationsService,
        private dialogRef: MatDialogRef<StationUpdateComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { header: string; station: StationsModel }
    ) {}

    ngOnInit(): void {
        this.loadRegionsData();
        this.header = this.data.header; // Dialog header text
        this.initializeForm();
        this.updateForm(this.data.station); // Patch form with station data if provided
    }

    loadRegionsData() {
        this.isLoading = true; // Start loader
        // this.stationsService.getAllRegions()?.subscribe(
        //     (response: any) => {
        //         if (response) {
        //             // If response is an object, convert it to an array
        //             this.regions = Object.values(response); // or Object.keys(response) if you need keys
        //
        //             console.log('RegionsData:', this.regions);  // Verify the structure is an array
        //         } else {
        //             console.error('No data found');
        //         }
        //         this.isLoading = false; // Stop loader
        //     },
        //     (error) => {
        //         console.error('Error loading station statuses:', error); // Error handling
        //         this.isLoading = false; // Stop loader
        //     }
        // );
        this.stationsService.getAllRegions()?.subscribe(
            (response: any) => {
                if (response) {
                    this.regions = response; // Set data into stationStatuses
                    console.log('RegionsData:', this.dataSource);
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

    private initializeForm(): void {
        this.editForm = this.fb.group({
            id: [null],
            code: ['', Validators.required],
            name: ['', Validators.required],
            region: ['', Validators.required],
            description: [''],
        });
    }

    private updateForm(station: StationsModel): void {
        if (station) {
            this.editForm.patchValue({
                id: station.id,
                code: station.code,
                name: station.name,
                region: station.region,
                description: station.description,
            });
        }
    }

    private createFromForm(): StationsModel {
        return {
            ...new StationsModel(),
            id: this.editForm.get('id')!.value,
            code: this.editForm.get('code')!.value,
            name: this.editForm.get('name')!.value,
            region: this.editForm.get('region')!.value,
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
        const station = this.createFromForm();
        const saveObservable = station.id
            ? this.stationsService.update(station)
            : this.stationsService.create(station);
        this.subscribeToSaveResponse(saveObservable);
    }

    private subscribeToSaveResponse(result: Observable<CustomResponse<StationsModel>>): void {
        result.pipe(finalize(() => (this.isSaving = false))).subscribe({
            next: () => this.onSaveSuccess(),
            error: (err) => this.onSaveError(err),
        });
    }

    private onSaveSuccess(): void {
        this.toastService.showSuccess('Station saved successfully!');
        this.dialogRef.close(true); // Close the dialog with success flag
        // this.loadData();
    }

    private onSaveError(error: any): void {
        console.error('Save error:', error);
        this.toastService.showError('Failed to save station!');
    }

    clearField(code: string) {
        
    }
}
