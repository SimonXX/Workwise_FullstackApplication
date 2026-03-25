import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Company, CompanyImpl } from '../../core/models/company.model';
import { CompanyProfileService } from './services/company-profile.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent implements OnInit {
  company: Company;
  editedCompany: Company;
  editingMode = false;
  email: string = localStorage.getItem('email') || '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private companyProfileService: CompanyProfileService
  ) {
    this.company = new CompanyImpl();
    this.editedCompany = new CompanyImpl();
  }

  ngOnInit(): void {
    this.loadMyCompany();
  }

  loadMyCompany(): void {
    this.companyProfileService.getCompanyInformation(this.email).subscribe({
      next: (response: any) => {
        this.company = response;
        this.editedCompany = { ...response };
      }
    });
  }

  goToCompanyArea(): void {
    this.router.navigate(['/companyArea']);
  }

  editProfile(): void {
    this.editingMode = true;
  }

  saveChanges(): void {
    this.companyProfileService.updateCompanyInformation(this.editedCompany).subscribe({
      next: (response: any) => {
        this.company = response;
      }
    });
    this.editingMode = false;
  }

  cancelEditing(): void {
    this.editingMode = false;
    this.loadMyCompany();
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

  logout(): void {
    this.authService.logout();
  }
}
