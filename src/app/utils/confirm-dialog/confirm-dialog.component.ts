import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<ConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  ngOnInit(): void {
    // You can leave this method empty or perform any initialization logic if needed
  }

  // Close the dialog with confirmation response
  onConfirm(): void {
    this.dialogRef.close(true); // Confirms the action
  }

  // Close the dialog with cancellation response
  onCancel(): void {
    this.dialogRef.close(false); // Cancels the action
  }

}
