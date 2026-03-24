import { Component, OnInit } from '@angular/core';
import { Application } from '../../core/models/application.model';
import { MyApplicationsService } from './services/my-applications.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { AuthService } from '../../core/services/auth.service';
import { ModifyStatusDialogComponent } from '../../shared/components/modify-status/modify-status.component';
import { UserInformationAppModel } from '../../core/models/userInformationApp.model';
import { Router } from '@angular/router';

type ApplicationField = 'id' | 'status' | 'jobOfferTitle' | 'location' | 'company';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    NgClass,
    DatePipe
  ],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.css'
})
export class MyApplicationsComponent implements OnInit {
  myApplications: Application[] = [];
  currentPage = 0;
  pageSize = 3;
  totalPages = 0;
  searchText = '';
  myFilteredApplications: Application[] = [];
  filterCriteria: ApplicationField = 'jobOfferTitle';
  statusFilter: string = '';
  role: string | undefined;

  constructor(
    private myApplicationsService: MyApplicationsService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    this.role = this.authService.getRoleFromToken(token ?? '');
    this.loadMyApplications();
  }

  loadMyApplications(): void {
    this.myApplicationsService.getMyApplications(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.myApplications = response.content;
        this.totalPages = response.totalPages;
        this.myFilteredApplications = this.searchText ? this.filterApplications() : this.myApplications;
        this.loadUserInformations();
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadMyApplications();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMyApplications();
    }
  }

  clearSearchText(): void {
    this.searchText = '';
    this.applySearch();
  }

  applySearch(): void {
    this.myFilteredApplications = this.filterApplications();
  }

  deleteApplication(applicationId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Withdraw Application',
        message: 'Are you sure you want to withdraw this application?',
        confirmText: 'Withdraw',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.myApplicationsService.deleteApplication(applicationId).subscribe({
          next: () => {
            this.showAlert('Success', 'Application withdrawn');
            this.loadMyApplications();
          }
        });
      }
    });
  }

  modifyApplication(applicationId: number, newStatus: string): void {
    this.myApplicationsService.modifyApplication(applicationId, newStatus).subscribe({
      next: () => {
        this.showAlert('Success', 'Application status updated');
        this.loadMyApplications();
      }
    });
  }

  openStatusDialog(application: { status: any; id: number }): void {
    const dialogRef = this.dialog.open(ModifyStatusDialogComponent, {
      width: '300px',
      data: { currentStatus: application.status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.modifyApplication(application.id, result);
      }
    });
  }

  navigateToProfile(email: string): void {
    this.router.navigate(['/profile'], { queryParams: { email, viewCompany: true } });
  }

  private filterApplications(): Application[] {
    return this.myApplications.filter(application =>
      this.getFieldValue(application, this.filterCriteria).toLowerCase().includes(this.searchText.toLowerCase()) &&
      (this.statusFilter === '' || application.status.toLowerCase() === this.statusFilter.toLowerCase())
    );
  }

  private getFieldValue(application: Application, field: ApplicationField): string {
    switch (field) {
      case 'id': return application.id.toString();
      case 'jobOfferTitle': return application.jobOffer.title;
      case 'status': return application.status;
      case 'location': return application.jobOffer.location;
      case 'company': return application.jobOffer.company.name;
      default: return '';
    }
  }

  private loadUserInformations(): void {
    this.myFilteredApplications.forEach(application => {
      this.myApplicationsService.getInformationByUserId(application.idUser).subscribe({
        next: (userInfo: UserInformationAppModel) => {
          application.userInformation = userInfo;
        }
      });
    });
  }

  private showAlert(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, { data: { title, message } });
  }
}
