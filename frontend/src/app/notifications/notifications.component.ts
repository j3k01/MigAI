import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from '../services/NotificationsService';
import { Notification } from '../models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private notificationService: NotificationsService
  ) {}

  ngOnInit() {
    this.fetchNotifications();
  }

  fetchNotifications() {
    this.loading = true;
    this.error = null;

    this.notificationService.getAll().subscribe({
      next: data => {
        this.notifications = data.map(n => ({
          ...n,
          newComment: '',
          date: new Date(n.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
        }));
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Nie udało się załadować powiadomień.';
        this.loading = false;
      }
    });
  }

react(post: any, type: 'like' | 'G' | 'POG' | 'kupsko') {
  if (post.userReaction) {
    post.reactions[post.userReaction]--;
    if (post.userReaction === type) {
      post.userReaction = null;
      return;
    }
  }
  post.reactions[type]++;
  post.userReaction = type;
}

  addComment(post: any) {
    const trimmed = post.newComment.trim();
    if (trimmed.length > 0) {
      post.comments.push(trimmed);
      post.newComment = '';
    }
  }

  backToMenu() {
    this.router.navigate(['/dashboard']);
  }
}
