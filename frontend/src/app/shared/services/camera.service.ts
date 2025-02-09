import { Injectable } from '@angular/core';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private hands: Hands;
  private pose: Pose;
  
  constructor(private http: HttpClient) {
    this.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    this.hands.setOptions({ maxNumHands: 1 });
    
    this.pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });
    this.pose.setOptions({ modelComplexity: 1 });
  }

  async processFrame(videoElement: HTMLVideoElement): Promise<number[]> {
    return new Promise((resolve) => {
      this.hands.onResults((results) => {
        if (!results.multiHandLandmarks) return resolve([]);
        const keypoints = results.multiHandLandmarks.flatMap(landmark => 
          landmark.map(point => [point.x, point.y, point.z]).flat()
        );
        resolve(keypoints);
      });
      this.hands.send({ image: videoElement });
    });
  }

  sendToAI(keypoints: number[]) {
    return this.http.post<{ predictedSign: number }>('http://localhost:8000/predict/', keypoints);
  }
}
