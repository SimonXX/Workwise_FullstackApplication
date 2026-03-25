import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { NgIf } from '@angular/common';
import { MatInput, MatSuffix } from '@angular/material/input';
import { CandidateProfileService } from '../candidate-profile/services/candidate-profile.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-candidate',
  standalone: true,
  imports: [
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatInput,
    ReactiveFormsModule,
    MatSuffix,
    NgIf,
    RouterLink
  ],
  templateUrl: './register-candidate.component.html',
  styleUrl: './register-candidate.component.css'
})
export class RegisterCandidateComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private candidateProfileService: CandidateProfileService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  register(): void {
    if (this.form.valid) {
      const userData = {
        ...this.form.value,
        dateOfBirth: this.form.value.dateOfBirth.toISOString().split('T')[0]
      };

      this.candidateProfileService.registerUser(userData).subscribe({
        next: () => {
          this.loginAfterRegistration(userData);
        },
        error: () => {
          this.markFormGroupTouched(this.form);
        }
      });
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  private loginAfterRegistration(userData: any): void {
    this.authService.login(userData.email, userData.password).subscribe({
      next: (response) => {
        if (response.status === 200) {
          const token = response.body.token;
          const role = this.authService.getRoleFromToken(token);
          if (role === 'CANDIDATE') {
            this.router.navigateByUrl('/candidateArea');
          } else if (role === 'COMPANY') {
            this.router.navigateByUrl('/companyArea');
          }
        }
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onKeyDown(event: KeyboardEvent): boolean {
    if (
      (event.key >= '0' && event.key <= '9') ||
      ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)
    ) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
