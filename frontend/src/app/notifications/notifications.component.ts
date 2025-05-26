import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from '../services/NotificationsService';
import { Notification } from '../models/notification.model';
import { AppComment } from '../models/comment.model';
import { ReactionType, Reaction } from '../models/reaction.model';
import Swal from 'sweetalert2';

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
  ReactionType = ReactionType;
  
  constructor(
    private router: Router,
    private notificationService: NotificationsService
  ) { }

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
          comments: [],
          reactions: [] as Reaction[],
          date: new Date(n.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
        }));

        this.notifications.forEach(post => {
          this.notificationService.getComments(post.id).subscribe({
            next: (comments) => post.comments = comments,
            error: () => {
              post.comments = [];
            }
          });
        }),
          this.notifications.forEach(post => {
            this.notificationService.getReactons(post.id).subscribe({
              next: (reactions) => post.reactions = reactions,
              error: () => {
                post.reactions = [];
              }
            });
          });

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Nie udało się załadować powiadomień.';
        this.loading = false;
      }
    });
  }

  addComment(post: Notification) {
    const trimmed = post.newComment?.trim();
    if (!trimmed) return;
    const userId = 1;
    this.notificationService.addComment(post.id, trimmed, userId)
      .subscribe({
        next: (comment) => {
          this.notificationService.getComments(post.id).subscribe({
            next: (comments) => {
              post.comments = comments;
              post.newComment = '';
              console.log(post.comments);
            },
            error: () => alert('Nie udało się pobrać komentarzy z bazy!')
          });
        },
        error: () => alert('Nie udało się dodać komentarza!')
      });
  }

  deleteComment(post: Notification, comment: AppComment) {
    Swal.fire({
      title: 'Czy na pewno usunąć ten komentarz?',
      text: 'Tej operacji nie można cofnąć!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Tak, usuń!',
      cancelButtonText: 'Anuluj',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notificationService.deleteComment(post.id, comment.id).subscribe({
          next: () => {
            post.comments = post.comments.filter(c => c.id !== comment.id);
            Swal.fire('Usunięto!', 'Komentarz został usunięty.', 'success');
          },
          error: () => Swal.fire('Błąd', 'Nie udało się usunąć komentarza!', 'error')
        });
      }
    });
  }

  countReaction(post: Notification, type: ReactionType): number {
    const arr = Array.isArray(post.reactions) ? post.reactions : [];
    return arr.filter(r => r.type === type).length;
  }


  react(post: Notification, type: number) {
    const userId = 1;

    const existing = post.reactions.find(r => r.userId === userId);

    if (existing) {
      if (existing.type === type) {
        this.notificationService.deleteReaction(post.id, existing.id).subscribe({
          next: () => {
            post.reactions = post.reactions.filter(r => r.id !== existing.id);
          },
          error: () => alert('Nie udało się usunąć reakcji!')
        });
      } else {
        this.notificationService.addOrUpdateReaction(post.id, type, userId).subscribe({
          next: (reaction) => {
            existing.type = reaction.type;
          },
          error: () => alert('Nie udało się zmienić reakcji!')
        });
      }
    } else {
      this.notificationService.addOrUpdateReaction(post.id, type, userId).subscribe({
        next: (reaction) => {
          post.reactions.push(reaction);
        },
        error: () => alert('Nie udało się dodać reakcji!')
      });
    }
  }

  backToMenu() {
    this.router.navigate(['/dashboard']);
  }
}
