import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chapters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss']
})
export class ChaptersComponent {
  chapters = [
    { id: 1, title: 'Powitania', description: 'Jak się przywitać czy pożegnać? Pierwsze kilka słów!' },
    { id: 2, title: 'Przedstawienie się', description: 'Kim jestem? Jak mam na imię? Kilka gestów które pomogą nam przedstawić się naszemu rozmówcy!' },
    { id: 3, title: 'lorem ipsum', description: 'lorem ipsumlorem ipsum' }
  ];

  constructor(private router: Router) {}

  goToLessons(chapterId: number) {
    this.router.navigate(['/lessons', chapterId]);
  }
}
