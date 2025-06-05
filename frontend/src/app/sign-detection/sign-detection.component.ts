import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FACEMESH_CONTOURS, Holistic } from '@mediapipe/holistic';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS, HAND_CONNECTIONS } from '@mediapipe/holistic';

@Component({
  selector: 'app-sign-detection',
  templateUrl: './sign-detection.component.html',
  styleUrls: ['./sign-detection.component.scss'],
  standalone: true
})
export class SignDetectionComponent implements AfterViewInit, OnDestroy { 
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @Input() expectedSigns: string[] = [];
  @Input() modelName: string = '';
  @Output() signDetected = new EventEmitter<string>(); 
  private stream: MediaStream | null = null;
  private detectionInterval: any;
  private holistic!: Holistic;
  isRecording = false; 
  predictedSign: string = '';
  countdown: number = 0;
  recordingProgress: number = 0; 

  detectSign(sign: string) {
    this.signDetected.emit(sign);
  }

    private runCountdown(): Promise<void> {
    return new Promise(res => {
      this.countdown = 3;
      const id = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(id);
          res();
        }
      }, 1000);
    });
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

    this.holistic = new Holistic({ locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}` });

    this.holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: false, 
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.holistic.onResults((results: any) => {
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
      if (results.faceLandmarks) {
        drawLandmarks(ctx, results.faceLandmarks, { color: 'green', radius: 1 });
      }

      const keypoints = this.extractKeypoints(results);

      if (keypoints.length > 0) {
        this.sendToBackend(keypoints);
      }
    });

  }

  async startRecording() {
    if (this.isRecording) { return; }

    this.sequence = [];
    this.predictedSign = '';
    this.recordingProgress = 0;
    this.isRecording = true;

    await this.runCountdown();

    const video = this.videoElement.nativeElement;
    this.detectionInterval = setInterval(async () => {
      await this.holistic.send({ image: video });
    }, 100);
  }

  stopRecording() {
    this.isRecording = false;
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
    }
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

  const face = results.faceLandmarks 
      ? results.faceLandmarks.slice(0, 468).flatMap((res: any) => [res.x, res.y, res.z]) 
      : Array(468 * 3).fill(0);
    
  
  const result = [...pose, ...face, ...lh, ...rh];

  console.log(`Pose: ${pose.length}, Face: ${face.length}, LH: ${lh.length}, RH: ${rh.length}, Total: ${result.length}`);
  
  return result;
  }
  
  sendToBackend(keypoints: number[]) {
    this.sequence.push(keypoints);
  
    if (this.sequence.length > 30) {
      this.sequence.shift();
    }
    this.recordingProgress = (this.sequence.length / 30) * 100;
    console.log(this.sequence.length)
    if (this.sequence.length === 30) { 
      console.log("📡 Wysyłane keypoints:", this.sequence.length, this.sequence);
      
      this.http.post<{ predictedSign: string }>('http://localhost:8000/predict/', { keypoints: [this.sequence] })
      .subscribe({
        next: (response) => {
          console.log("✅ Odpowiedź API:", response);
          this.predictedSign = response.predictedSign;
          this.signDetected.emit(response.predictedSign);
          this.stopRecording();
        },
        error: (err) => {
          console.error("🚨 Błąd API:", err);
          this.stopRecording();
        }});
    }
  }
  ngOnDestroy() {
    if (this.stream)
    {
      this.stream.getTracks().forEach(track => track.stop());
    }

    this.stopRecording();

  }
}
