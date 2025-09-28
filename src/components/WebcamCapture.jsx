import { useRef, useEffect, useState, useCallback } from 'react';

export const WebcamCapture = ({ onPrediction, isRecording }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start webcam
  const startWebcam = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Failed to access webcam. Please ensure camera permissions are granted.');
      console.error('Error accessing webcam:', err);
    }
  }, []);

  // Stop webcam
  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Capture frame and send to API
  const captureAndPredict = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isRecording) return;

    try {
      setIsLoading(true);
      console.log('Starting prediction...');
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Check if video is ready
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.log('Video not ready yet');
        return;
      }
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Image captured, sending to API...');
      
      // Send to backend API
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Prediction result:', result);
      
      // Send prediction to parent component
      if (onPrediction) {
        onPrediction(result);
      }
      
    } catch (err) {
      console.error('Error making prediction:', err);
      setError(`Failed to get prediction: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isRecording, onPrediction]);

  // Start/stop prediction loop based on recording state
  useEffect(() => {
    if (isRecording && videoRef.current) {
      // Start prediction loop (every 500ms for smooth experience)
      intervalRef.current = setInterval(captureAndPredict, 500);
    } else {
      // Stop prediction loop
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, captureAndPredict]);

  // Initialize webcam on component mount
  useEffect(() => {
    startWebcam();
    
    return () => {
      stopWebcam();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startWebcam, stopWebcam]);

  return (
    <div className="relative">
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-lg border-2 border-[#666A86]"
        onLoadedMetadata={() => {
          // Ensure video is playing
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        }}
      />
      
      {/* Hidden canvas for frame capture */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg max-w-xs text-center">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            <button 
              onClick={startWebcam}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-2 left-2">
          <div className="flex items-center space-x-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Recording</span>
          </div>
        </div>
      )}
    </div>
  );
};
