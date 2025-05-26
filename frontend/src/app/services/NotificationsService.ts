import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Notification } from '../models/notification.model'
import { AppComment } from '../models/comment.model';
import { Reaction } from '../models/reaction.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    private apiUrl = 'https://localhost:7127/api/notification';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.apiUrl}`);
    }

    addComment(notificationId: number, content: string, userId: number): Observable<AppComment> {
        return this.http.post<AppComment>(
            `${this.apiUrl}/${notificationId}/comment`,
            { content, userId }
        );
    }

    getComments(notificationId: number): Observable<AppComment[]> {
        return this.http.get<AppComment[]>(`${this.apiUrl}/${notificationId}/comments`);
    }

    deleteComment(notificationId: number, commentId: number) {
        return this.http.delete(
            `${this.apiUrl}/comment/${notificationId}/${commentId}`
        );
    }

    getReactons(notificationId: number): Observable<Reaction[]> {
        return this.http.get<Reaction[]>(`${this.apiUrl}/${notificationId}/reactions`);
    }

    addOrUpdateReaction(notificationId: number, type: number, userId: number): Observable<Reaction> {
        return this.http.post<Reaction>(
            `${this.apiUrl}/${notificationId}/reaction`,
            { type, userId }
        );
    }

    deleteReaction(notificationId: number, reactionId: number): Observable<any> {
        return this.http.delete(
            `${this.apiUrl}/${notificationId}/reaction/${reactionId}`
        );
    }
}