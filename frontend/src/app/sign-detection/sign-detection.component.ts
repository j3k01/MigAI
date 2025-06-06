import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FACEMESH_CONTOURS, Holistic } from '@mediapipe/holistic';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS, HAND_CONNECTIONS } from '@mediapipe/holistic';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-sign-detection',
  templateUrl: './sign-detection.component.html',
  styleUrls: ['./sign-detection.component.scss'],
  imports: [CommonModule],
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
  sequence: number[][] = [];

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
    await this.initializeCamera();
    await this.initializeHolistic();
  }

  private async initializeCamera() {
    const video = this.videoElement.nativeElement;
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.stream;
      await video.play();
    } catch (error) {
      console.error('Błąd dostępu do kamery:', error);
    }
  }

  private async initializeHolistic() {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    this.holistic = new Holistic({ 
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}` 
    });

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
      this.processing = false;
      this.drawResults(ctx, canvas, results);
      
      if (this.isRecording && this.countdown === 0) {
        const keypoints = this.extractKeypoints(results);
        if (keypoints.length > 0) {
          this.collectKeypoints(keypoints);
        }
      }
    });
  }

  private drawResults(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, results: any) {
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
  }

  async startRecording() {
    if (this.isRecording) { 
      return; 
    }

    this.resetRecordingState();
    this.isRecording = true;

    console.log('🎬 Rozpoczynanie nowego nagrania...');
    
    await this.runCountdown();

    this.startVideoProcessing();
  }

  private resetRecordingState() {
    this.sequence = [];
    this.predictedSign = '';
    this.recordingProgress = 0;
    console.log('🔄 Stan nagrania zresetowany');
  }
  private processing = false;

  private startVideoProcessing() {
    const video = this.videoElement.nativeElement;
    
    this.detectionInterval = setInterval(async () => {
      if (this.isRecording && video.readyState === 4) {
        this.processing = true; 
        await this.holistic.send({ image: video });
      }
    }, 100);
  }

  stopRecording() {
    console.log('🛑 Zatrzymywanie nagrania...');
    this.isRecording = false;
    this.countdown = 0;
    
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
  }

  private extractKeypoints(results: any): number[] {
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
    return result;
  }
  
  private collectKeypoints(keypoints: number[]) {
    this.sequence.push(keypoints);
    console.log(`📊 Zebrano keypoints: ${this.sequence.length}/30`);
  
    if (this.sequence.length > 30) {
      this.sequence.shift();
    }
    
    this.recordingProgress = (this.sequence.length / 30) * 100;
    
    if (this.sequence.length === 30) { 
      this.sendToBackend();
    }
  }

  private sendToBackend() {
    console.log("📡 Wysyłanie do API:", this.sequence.length, "klatek");
    
    const sequenceToSend = [...this.sequence];
    
    this.http.post<{ predictedSign: string }>('http://localhost:8000/predict/', { 
      keypoints: [sequenceToSend] 
    }).subscribe({
      next: (response) => {
        console.log("✅ Odpowiedź API:", response);
        this.predictedSign = response.predictedSign;
        this.signDetected.emit(response.predictedSign);
        this.stopRecording();
      },
      error: (err) => {
        console.error("🚨 Błąd API:", err);
        this.stopRecording();
      }
    });
  }

  ngOnDestroy() {
    this.stopRecording();
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    if (this.holistic) {
      this.holistic.close();
    }
  }
}