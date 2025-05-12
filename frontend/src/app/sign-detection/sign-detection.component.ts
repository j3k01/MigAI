import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holistic } from '@mediapipe/holistic';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS, HAND_CONNECTIONS } from '@mediapipe/holistic';

@Component({
  selector: 'app-sign-detection',
  templateUrl: './sign-detection.component.html',
  styleUrls: ['./sign-detection.component.scss'],
  standalone: true
})
export class SignDetectionComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @Input() expectedSigns: string[] = [];
  @Input() modelName: string = '';
  @Output() signDetected = new EventEmitter<string>(); 
  private stream: MediaStream | null = null;
  private detectionInterval: any;
  predictedSign: string = '';

  detectSign(sign: string) {
    this.signDetected.emit(sign);
  }

  constructor(private http: HttpClient) {}

  async ngAfterViewInit() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.stream = stream;
      video.srcObject = stream;
      video.play();
    });

    const holistic = new Holistic({ locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}` });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: false
    });

    holistic.onResults((results: any) => { 
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: 'white' });
      }
      if (results.leftHandLandmarks) {
        drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: 'blue' });
      }
      if (results.rightHandLandmarks) {
        drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: 'red' });
      }

      const keypoints = this.extractKeypoints(results);

      if (keypoints.length > 0) {
        this.sendToBackend(keypoints);
      }
    });

    this.detectionInterval = setInterval(async () => {
      await holistic.send({ image: video });
    }, 1000);
  }

  sequence: number[][] = [];

  extractKeypoints(results: any): number[] {
    const pose = results.poseLandmarks 
        ? results.poseLandmarks.flatMap((res: any) => [res.x, res.y, res.z, res.visibility]) 
        : Array(33 * 4).fill(0);
  
    const lh = results.leftHandLandmarks 
        ? results.leftHandLandmarks.flatMap((res: any) => [res.x, res.y, res.z]) 
        : Array(21 * 3).fill(0);
  
    const rh = results.rightHandLandmarks 
        ? results.rightHandLandmarks.flatMap((res: any) => [res.x, res.y, res.z]) 
        : Array(21 * 3).fill(0);
  
    return [...pose, ...lh, ...rh];
  }
  
  sendToBackend(keypoints: number[]) {
    this.sequence.push(keypoints);
  
    if (this.sequence.length > 30) {
      this.sequence.shift();
    }
    console.log(this.sequence.length)
    if (this.sequence.length === 30) { 
      console.log("📡 Wysyłane keypoints:", this.sequence.length, this.sequence);
      
      this.http.post<{ predictedSign: string }>('http://localhost:8000/predict/', { keypoints: [this.sequence] })
      .subscribe({
        next: (response) => {
          console.log("✅ Odpowiedź API:", response);
          this.predictedSign = response.predictedSign;
          this.signDetected.emit(response.predictedSign);
        },
        error: (err) => console.error("🚨 Błąd API:", err)
      });
    }
  }
  ngOnDestroy() {
    if (this.stream)
    {
      this.stream.getTracks().forEach(track => track.stop());
    }

    if(this.detectionInterval)
    {
      clearInterval(this.detectionInterval);
    }
  }
}
