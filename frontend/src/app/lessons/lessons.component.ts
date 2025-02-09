import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SignDetectionComponent } from '../sign-detection/sign-detection.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [ SignDetectionComponent, CommonModule ],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  chapterId: number | null = null;
  lessonTitle = '';
  lessonDescription = '';
  lessonVideoUrl: SafeResourceUrl | null = null;
  lessonSigns: string[] = [];
  modelName: string = '';
  message = '';
  showSignDetection = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.chapterId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.chapterId !== null) {
      this.loadLessonData(this.chapterId);
    }
  }

  loadLessonData(chapterId: number) {
    this.http.get<{ title: string, description: string, videoUrl: string, signs: string[], model: string }>(
      `https://localhost:7127/api/lesson/${chapterId}`
    ).subscribe({
      next: (data) => {
        this.lessonTitle = data.title;
        this.lessonDescription = data.description;
        this.lessonVideoUrl = this.sanitizeUrl(data.videoUrl);
        this.lessonSigns = data.signs;
        this.modelName = data.model;
      },
      error: (error) => console.error("🚨 Błąd ładowania lekcji:", error)
    });
  }

  startSignDetection() {
    this.showSignDetection = true;
  }

  checkSign(detectedSign: string) {
    if (this.lessonSigns.includes(detectedSign)) {  
      this.message = `✅ Dobrze! Rozpoznano znak: ${detectedSign}.`;
    } else {
      this.message = `❌ Spróbuj ponownie!`;
    }
  }

  nextLesson() {
    if (this.chapterId !== null) {
      this.router.navigate(['/lessons', this.chapterId + 1]);
    }
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    if (!url) return '';
    const embeddedUrl = url.replace("watch?v=", "embed/"); 
    return this.sanitizer.bypassSecurityTrustResourceUrl(embeddedUrl);
  }
}
