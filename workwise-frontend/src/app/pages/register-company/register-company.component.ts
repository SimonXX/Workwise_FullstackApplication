import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CompanyProfileService } from '../company-profile/services/company-profile.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.css'
})
export class RegisterCompanyComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyProfileService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      address: ['', Validators.required],
      website: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  register(): void {
    if (this.form.valid) {
      const companyData = { ...this.form.value };

      this.companyService.registerCompany(companyData).subscribe({
        next: () => {
          this.loginAfterRegistration(companyData);
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
