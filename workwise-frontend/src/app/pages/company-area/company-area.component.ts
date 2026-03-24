import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { JobOffersComponent } from '../../features/job-offers/job-offers.component';
import { MyApplicationsComponent } from '../../features/my-applications/my-applications.component';
import { NgIf } from '@angular/common';
import { NotificationsComponent } from '../../features/notifications/notifications.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company-area',
  standalone: true,
  imports: [
    JobOffersComponent,
    MyApplicationsComponent,
    NgIf,
    NotificationsComponent,
    RouterLink
  ],
  templateUrl: './company-area.component.html',
  styleUrl: './company-area.component.css'
})
export class CompanyAreaComponent {
  activePanel: 'jobOffers' | 'myApplications' = 'jobOffers';
  showNotifications = true;
  name = localStorage.getItem('email');

  constructor(private authService: AuthService) {}

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  logout(): void {
    this.authService.logout();
  }

  togglePanel(panel: 'jobOffers' | 'myApplications'): void {
    this.activePanel = panel;
  }
}
