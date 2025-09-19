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