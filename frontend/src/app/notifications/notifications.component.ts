import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  
  constructor(
    private router: Router
  ) {}

  notifications = [
    {
      title: 'dupadupaduupa',
      date: new Date('2025-05-10'),
      content: 'dupadupaduupadupadupaduupadupadupaduupa',
      reactions: { like: 0, G: 0, POG: 0, kupsko: 0},
      comments: [] as string[],
      newComment: ''
    },
    {
      title: 'dupadupaduupa💡',
      date: new Date('2025-05-08'),
      content: 'dupadupaduupadupadupaduupadupadupaduupa',
      reactions: { like: 0, G: 0, POG: 0, kupsko: 0},
      comments: [],
      newComment: ''
    },
    {
      title: 'dupadupaduupadupadupaduupadupadupaduupa',
      date: new Date('2025-05-01'),
      content: 'dupadupaduupadupadupaduupadupadupaduupadupadupaduupa',
      reactions: { like: 0, G: 0, POG: 0, kupsko: 0},
      comments: [],
      newComment: ''
    }
  ];

  react(post: any, type: 'like' | 'G' | 'POG' | 'kupsko') {
    post.reactions[type]++;
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
