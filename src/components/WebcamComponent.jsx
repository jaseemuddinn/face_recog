// 'use client';
// import React, { useRef, useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
// import * as faceapi from 'face-api.js';
// import { loadModels } from '@/utils/FaceApi';

// const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

// const WebcamComponent = () => {
//   const webcamRef = useRef(null);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);

//   useEffect(() => {
//     const loadFaceApiModels = async () => {
//       // const faceapi = await import('face-api.js');
//       await loadModels();
//       console.log('Face detection models loaded');
//       setIsModelLoaded(true);
//     };
//     loadFaceApiModels();
//   }, []);

//   const handleUserMediaError = (error )=>{
//     console.error('handleUserMediaError', error);
//   }

//   const detectFaces = async () => {
//     if (webcamRef.current && isModelLoaded) {
//       const video = webcamRef.current.video;
//       console.log('Video ready state:', video.readyState);
//       if (video.readyState === 4) {
//         const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks()
//           .withFaceDescriptors();

//         if (detections.length > 0) {
//           console.log('Faces detected:', detections);
//         } else {
//           console.log('No faces detected');
//         }
//       } else {
//         console.log('Video not ready');
//       }
//     }
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       detectFaces();
//     }, 100);

//     return () => clearInterval(intervalId);
//   }, [isModelLoaded]);

//   return (
//     <div>
//       <h2>Webcam Feed with Face Detection</h2>
//       {typeof window !== 'undefined' && (
//         <Webcam
//           ref={webcamRef}
//           audio={false}
//           screenshotFormat="image/jpeg"
//           videoConstraints={{
//             facingMode: "user"
//           }}
//           onUserMediaError={handleUserMediaError}
//         />
//       )}
//       {!isModelLoaded && <p>Loading face detection models...</p>}
//     </div>
//   );
// };

// export default WebcamComponent;

"use client";
import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as faceapi from "face-api.js";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

const WebcamComponent = () => {
  const webcamRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsModelLoaded(true);
        requestAnimationFrame(detectFaces);
      } catch (error) {
        console.error("Failed to load models", error);
      }
    };
    loadModels();
    console.log("models loaded");
  }, []);

  const detectFaces = async () => {
    // console.log("detectFaces");
    if (webcamRef.current && isModelLoaded) {
      console.log("Webcam ref:", webcamRef.current);
      const video = webcamRef.current.video;
      console.log("Video ready state:", video.readyState);

      if (video.readyState === 4) {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          console.log("Faces detected:", detections);
        } else {
          console.log("No faces detected");
        }
      } else {
        console.log("Video not ready");
      }
    }

    // Continue detecting faces using requestAnimationFrame
    requestAnimationFrame(detectFaces);
  };

  return (
    <div>
      <h2>Webcam Feed with Face Detection</h2>
      <Webcam
        ref={webcamRef}
        audio={false}
        videoConstraints={{ facingMode: "user" }}
      />
    </div>
  );
};

export default WebcamComponent;
