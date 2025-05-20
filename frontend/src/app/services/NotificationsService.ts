import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Notification } from '../models/notification.model'

@Injectable({ providedIn: 'root'})
export class NotificationsService {
    private apiUrl = 'https://localhost:7127/api/notification';

    constructor(private http: HttpClient) {}

    getAll(): Observable<Notification[]>{
        return this.http.get<Notification[]>(`${this.apiUrl}`);
    }
}