import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CameraService } from '../shared/services/camera.service';

@Component({
  selector: 'app-sign-detection',
  standalone: true,
  templateUrl: './sign-detection.component.html',
  styleUrls: ['./sign-detection.component.scss']
})
export class SignDetectionComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @Input() expectedSign!: string;
  @Output() signDetected = new EventEmitter<string>();

  predictedSign: string = '';
  isCorrectSign: boolean | null = null;
  signLabels: string[] = ["Cześć", "Dziękuję", "Przepraszam"];

  constructor(private cameraService: CameraService) {}

  async ngAfterViewInit() {
    const video = this.videoElement.nativeElement;
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      video.srcObject = stream;
      video.play();
    });

    setInterval(async () => {
      const keypoints = await this.cameraService.processFrame(video);
      if (keypoints.length > 0) {
        this.cameraService.sendToAI(keypoints).subscribe(response => {
          this.predictedSign = this.signLabels[response.predictedSign] || "Nieznany znak";
          this.isCorrectSign = this.predictedSign === this.expectedSign;

          this.signDetected.emit(this.predictedSign);
        });
      }
    }, 1000);
  }
}
