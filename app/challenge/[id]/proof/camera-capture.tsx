"use client";

import { useRef, useState, useCallback } from "react";
import { submitProofAction } from "@/app/actions/proof";
import { cn } from "@/lib/utils";

export function CameraCapture({ challengeId }: { challengeId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMsg("Failed to access camera. Please check permissions.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setPhoto(null);
    startCamera();
  };

  // Convert base64 to file and submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!photo) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // Convert base64 to blob
      const res = await fetch(photo);
      const blob = await res.blob();
      formData.append("image", blob, "proof.jpg");
      formData.append("challengeId", challengeId);

      // Submit via action
      const result = await submitProofAction(formData);
      
      if (result?.error) {
        setErrorMsg(result.error);
        setIsSubmitting(false);
      } else {
        // Redirection happens in action
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to upload proof.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {errorMsg && (
        <div className="bg-wab-red text-wab-offwhite p-4 font-mono text-sm font-bold uppercase tracking-widest border border-wab-offwhite/20">
          {errorMsg}
        </div>
      )}

      {/* Camera Viewport */}
      <div className="relative aspect-[3/4] md:aspect-square w-full bg-neutral-900 border border-wab-offwhite/20 overflow-hidden flex items-center justify-center">
        {!photo && !cameraActive && (
          <button 
            type="button"
            onClick={startCamera}
            className="bg-wab-yellow text-wab-black font-mono text-sm font-bold uppercase tracking-widest px-6 py-4 hover:bg-wab-offwhite transition-colors"
          >
            Start Camera
          </button>
        )}
        
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          className={cn("absolute inset-0 w-full h-full object-cover", !cameraActive && "hidden")}
        />
        
        <canvas ref={canvasRef} className="hidden" />

        {photo && (
          <img src={photo} alt="Proof" className="absolute inset-0 w-full h-full object-cover" />
        )}

        {/* Capture Overlay */}
        {cameraActive && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button 
              type="button"
              onClick={takePhoto}
              className="w-20 h-20 rounded-full border-4 border-wab-offwhite bg-wab-red hover:bg-wab-yellow transition-colors"
            />
          </div>
        )}
      </div>

      {/* Submission Form */}
      {photo && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={retake}
              disabled={isSubmitting}
              className="flex-1 border border-wab-offwhite/50 text-wab-offwhite font-mono text-xs uppercase tracking-widest p-4 hover:bg-wab-offwhite/10"
            >
              Retake
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="font-mono text-sm uppercase font-bold text-wab-offwhite/80" htmlFor="workoutType">Workout Type</label>
            <select 
              id="workoutType" 
              name="workoutType" 
              className="border border-wab-offwhite/30 p-4 font-sans outline-none focus:ring-2 focus:ring-wab-yellow bg-neutral-900 text-wab-offwhite"
              required
            >
              <option value="GYM">Gym / Weightlifting</option>
              <option value="CARDIO">Cardio / Running</option>
              <option value="CALISTHENICS">Calisthenics</option>
              <option value="SPORTS">Sports</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-sm uppercase font-bold text-wab-offwhite/80" htmlFor="notes">Notes (Optional)</label>
            <textarea 
              id="notes" 
              name="notes" 
              placeholder="Crushed legs today."
              className="border border-wab-offwhite/30 p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-wab-yellow bg-neutral-900 text-wab-offwhite resize-none h-24"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "w-full bg-wab-yellow text-wab-black font-display text-2xl uppercase tracking-widest p-4 transition-colors border border-wab-black",
              "hover:bg-wab-offwhite",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Uploading..." : "Submit Proof →"}
          </button>
        </form>
      )}
    </div>
  );
}
