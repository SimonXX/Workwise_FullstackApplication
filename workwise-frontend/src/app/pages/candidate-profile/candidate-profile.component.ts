import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSuffix } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../core/services/auth.service';
import { CandidateProfileService } from './services/candidate-profile.service';
import { User, UserImpl } from '../../core/models/user.model';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    FormsModule,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSuffix
  ],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.css'
})
export class CandidateProfileComponent implements OnInit {
  user: User;
  editedUser: User;
  viewCompany: boolean = false;
  email: string = '';
  editingMode = false;
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private candidateProfileService: CandidateProfileService,
    private route: ActivatedRoute
  ) {
    this.user = new UserImpl();
    this.editedUser = new UserImpl();

    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || null;
      this.viewCompany = params['viewCompany'];
    });
  }

  ngOnInit(): void {
    this.loadMyUser();
  }

  loadMyUser(): void {
    this.candidateProfileService.getMyInformation(this.email).subscribe({
      next: (response: any) => {
        this.user = response;
        this.editedUser = { ...response };
      }
    });
  }

  goToCandidateArea(): void {
    this.router.navigate(['/candidateArea']);
  }

  editProfile(): void {
    this.editingMode = true;
  }

  saveChanges(): void {
    this.candidateProfileService.updateUserInformation(this.editedUser).subscribe({
      next: (response: any) => {
        this.user = response;
      }
    });
    this.editingMode = false;
  }

  cancelEditing(): void {
    this.editingMode = false;
    this.loadMyUser();
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

  protected readonly localStorage = localStorage;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadCV(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editedUser.cvBase64 = e.target.result.split(',')[1];
        this.saveChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  downloadCV(): void {
    if (this.user.cvBase64) {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${this.user.cvBase64}`;
      link.download = 'CV.pdf';
      link.click();
    }
  }
}
