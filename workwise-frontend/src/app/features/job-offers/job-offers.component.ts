import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobOffer } from '../../core/models/job-offer.model';
import { JobOffersService } from './services/job-offer.service';
import { MatDialog } from '@angular/material/dialog';
import { Application } from '../../core/models/application.model';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../core/services/auth.service';
import { AddJobOfferDialogComponent } from '../../shared/components/add-job-offer-dialog/add-job-offer-dialog.component';

type JobOfferField = 'id' | 'title' | 'location' | 'company';

@Component({
  selector: 'app-job-offers',
  templateUrl: 'job-offers.component.html',
  standalone: true,
  styleUrls: ['./job-offers.component.css'],
  imports: [
    DatePipe,
    CommonModule,
    FormsModule
  ]
})
export class JobOffersComponent implements OnInit {
  jobOffers: JobOffer[] = [];
  filteredJobOffers: JobOffer[] = [];
  currentPage = 0;
  pageSize = 3;
  totalPages = 0;
  searchText = '';
  filterCriteria: JobOfferField = 'title';
  role: string | undefined;

  constructor(
    private jobOffersService: JobOffersService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    this.role = this.authService.getRoleFromToken(token ?? '');
    this.loadJobOffers();
  }

  loadJobOffers(): void {
    this.jobOffersService.getJobOffers(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.jobOffers = response.content;
        this.totalPages = response.totalPages;
        this.filteredJobOffers = this.searchText ? this.filterOffers() : this.jobOffers;
      }
    });
  }

  applyJobOffer(jobOfferId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Application',
        message: 'Do you want to apply to this job offer?',
        confirmText: 'Apply',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jobOffersService.applyJobOffer(jobOfferId).subscribe({
          next: () => {
            this.showAlert('Success', 'Application submitted successfully');
            this.loadJobOffers();
          }
        });
      }
    });
  }

  deleteJobOffer(jobOfferId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Do you want to delete this job offer?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jobOffersService.deleteJobOffer(jobOfferId).subscribe({
          next: () => {
            this.showAlert('Success', 'Job offer deleted');
            this.loadJobOffers();
          }
        });
      }
    });
  }

  addJobOffers(newJobOffer: JobOffer): void {
    this.jobOffersService.addJobOffer(newJobOffer).subscribe({
      next: () => {
        this.showAlert('Success', 'New job offer added');
        this.loadJobOffers();
      }
    });
  }

  editJobOffers(newJobOffer: JobOffer, jobOfferId: number): void {
    newJobOffer.id = jobOfferId;
    this.jobOffersService.modifyJobOffer(newJobOffer).subscribe({
      next: () => {
        this.showAlert('Success', 'Job offer updated');
        this.loadJobOffers();
      }
    });
  }

  openAddJobOfferDialog(): void {
    const dialogRef = this.dialog.open(AddJobOfferDialogComponent, {
      width: '600px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addJobOffers(result);
      }
    });
  }

  openEditJobOffer(jobOfferId: number): void {
    const existingJobOffer = this.jobOffers.find(offer => offer.id === jobOfferId);

    const dialogRef = this.dialog.open(AddJobOfferDialogComponent, {
      width: '600px',
      data: {
        mode: 'edit',
        jobOffer: existingJobOffer
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editJobOffers(result, jobOfferId);
      }
    });
  }

  applySearch(): void {
    this.filteredJobOffers = this.filterOffers();
  }

  clearSearchText(): void {
    this.searchText = '';
    this.applySearch();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadJobOffers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadJobOffers();
    }
  }

  private filterOffers(): JobOffer[] {
    return this.jobOffers.filter(jobOffer =>
      this.getFieldValue(jobOffer, this.filterCriteria).toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  private getFieldValue(jobOffer: JobOffer, field: JobOfferField): string {
    switch (field) {
      case 'id': return jobOffer.id.toString();
      case 'title': return jobOffer.title;
      case 'location': return jobOffer.location;
      case 'company': return jobOffer.company.name;
      default: return '';
    }
  }

  private showAlert(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, { data: { title, message } });
  }
}
