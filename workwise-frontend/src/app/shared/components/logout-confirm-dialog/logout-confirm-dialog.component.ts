import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirm-dialog',
  templateUrl: './logout-confirm-dialog.component.html',
  styleUrls: ['./logout-confirm-dialog.component.css']
})
export class LogoutConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<LogoutConfirmDialogComponent>) {}

  confirmLogout(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
