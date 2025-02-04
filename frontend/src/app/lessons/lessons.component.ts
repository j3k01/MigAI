import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignDetectionComponent } from '../sign-detection/sign-detection.component';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [ SignDetectionComponent ],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent {
  chapterId: number | null = null;
  lessonTitle = "Lekcja 1: Nauka znaku 'Cześć'";
  expectedSign = "Cześć";
  message = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.chapterId = Number(this.route.snapshot.paramMap.get('id'));
  }

  checkSign(detectedSign: string) {
    if (detectedSign === this.expectedSign) {
      this.message = "✅ Dobrze! Wykonałeś znak poprawnie.";
    } else {
      this.message = "❌ Spróbuj ponownie!";
    }
  }
}
