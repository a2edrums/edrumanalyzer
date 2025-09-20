import React, { useRef, useEffect, useCallback } from 'react';
import { getAudioData } from '../utils/audioUtils';

const WaveformVisualizer = ({ isRecording, onAudioData }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const stopVisualization = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const startVisualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const draw = () => {
      const audioData = getAudioData();
      
      if (audioData) {
        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // Y-axis markers (amplitude)
        for (let i = 0; i <= 4; i++) {
          const y = (height / 4) * i;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        
        // X-axis markers (time)
        for (let i = 0; i <= 8; i++) {
          const x = (width / 8) * i;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        
        // Draw center line
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        
        // Draw waveform
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const sliceWidth = width / audioData.length;
        let x = 0;
        
        for (let i = 0; i < audioData.length; i++) {
          const v = audioData[i] / 128.0;
          const y = (v * height) / 2;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          
          x += sliceWidth;
        }
        
        ctx.stroke();
        
        // Store audio data for analysis
        if (onAudioData) {
          onAudioData(Array.from(audioData));
        }
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  }, [onAudioData]);

  useEffect(() => {
    if (isRecording) {
      startVisualization();
    } else {
      stopVisualization();
    }
    
    return () => stopVisualization();
  }, [isRecording, startVisualization, stopVisualization]);



  return (
    <div className="waveform-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

export default WaveformVisualizer;