import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-add-job-offer-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    MatInput,
    MatSuffix,
    MatLabel
  ],
  templateUrl: './add-job-offer-dialog.component.html',
  styleUrl: './add-job-offer-dialog.component.css'
})
export class AddJobOfferDialogComponent {
  form: FormGroup;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddJobOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogTitle = data?.mode === 'add' ? 'Add New Job Offer' : 'Edit This Job Offer';
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      expirydate: ['', Validators.required]
    });

    // If editing, populate the form with existing data
    if (data?.mode === 'edit' && data?.jobOffer) {
      this.form.patchValue(data.jobOffer);
    }
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
