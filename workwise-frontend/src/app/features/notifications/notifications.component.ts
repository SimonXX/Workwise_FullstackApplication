import { Component, OnInit } from '@angular/core';
import { Notification } from '../../core/models/notification.model';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NotificationsService } from './services/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  currentPage = 0;
  pageSize = 3;
  totalPages = 0;

  constructor(
    private notificationsService: NotificationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationsService.getAllMyNotifications(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.notifications = response.content;
        this.totalPages = response.totalPages;
      }
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationsService.markAsRead(notificationId).subscribe({
      next: () => this.loadNotifications()
    });
  }

  markAsUnread(notificationId: number): void {
    this.notificationsService.markUsUnread(notificationId).subscribe({
      next: () => this.loadNotifications()
    });
  }

  deleteNotification(notificationId: number): void {
    this.notificationsService.deleteNotification(notificationId).subscribe({
      next: () => this.loadNotifications()
    });
  }

  clearNotifications(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Clear All Notifications',
        message: 'Are you sure you want to delete all notifications?',
        confirmText: 'Delete All',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationsService.deleteAllNotifications().subscribe({
          next: () => {
            this.dialog.open(AlertDialogComponent, {
              data: { title: 'Success', message: 'All notifications deleted' }
            });
            this.loadNotifications();
          }
        });
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadNotifications();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadNotifications();
    }
  }
}
