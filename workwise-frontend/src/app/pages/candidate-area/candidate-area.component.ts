import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobOffersComponent } from '../../features/job-offers/job-offers.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsComponent } from '../../features/notifications/notifications.component';
import { MyApplicationsComponent } from '../../features/my-applications/my-applications.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-area',
  standalone: true,
  imports: [
    CommonModule,
    JobOffersComponent,
    NotificationsComponent,
    MyApplicationsComponent
  ],
  templateUrl: './candidate-area.component.html',
  styleUrl: './candidate-area.component.css'
})
export class CandidateAreaComponent {
  activePanel: 'jobOffers' | 'myApplications' = 'jobOffers';
  showNotifications = true;
  name: string;

  constructor(private authService: AuthService, private router: Router) {
    const storedEmail = localStorage.getItem('email');
    this.name = storedEmail !== null ? storedEmail : '';
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  logout(): void {
    this.authService.logout();
  }

  togglePanel(panel: 'jobOffers' | 'myApplications'): void {
    this.activePanel = panel;
  }

  redirectToProfile(): void {
    this.router.navigate(['/profile'], { queryParams: { email: this.name } });
  }
}
