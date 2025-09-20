import React, { useState, useEffect, useCallback } from 'react';
import { Button, Badge, Form } from 'react-bootstrap';
import { BsPlay, BsStop, BsTrash } from 'react-icons/bs';
import { detectDrumStrike } from '../utils/waveformAnalysis';

const RecordingControls = ({ onRecordingChange, onClear, isConnected, audioData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [autoStop, setAutoStop] = useState(true);
  const [recordingBuffer, setRecordingBuffer] = useState([]);

  const handleStart = () => {
    if (!isConnected) return;
    
    setIsRecording(true);
    setRecordingBuffer([]);
    if (onRecordingChange) onRecordingChange(true);
  };

  const handleStop = useCallback(() => {
    setIsRecording(false);
    if (onRecordingChange) onRecordingChange(false);
  }, [onRecordingChange]);

  const handleClear = () => {
    setRecordingBuffer([]);
    if (onClear) onClear();
  };

  // Auto-stop detection
  useEffect(() => {
    if (isRecording && autoStop && audioData && audioData.length > 0) {
      const newBuffer = [...recordingBuffer, ...audioData];
      setRecordingBuffer(newBuffer);
      
      // Check for drum strike in recent data
      if (newBuffer.length > 1000 && detectDrumStrike(audioData)) {
        // Wait a bit more to capture the full strike, then stop
        setTimeout(() => {
          handleStop();
        }, 200);
      }
    }
  }, [audioData, isRecording, autoStop, recordingBuffer, handleStop]);

  return (
    <div className="d-flex align-items-center gap-3">
      <Button
        variant={isRecording ? 'danger' : 'success'}
        onClick={isRecording ? handleStop : handleStart}
        disabled={!isConnected}
      >
        {isRecording ? (
          <><BsStop /> Stop Recording</>
        ) : (
          <><BsPlay /> Start Recording</>
        )}
      </Button>
      
      <Button
        variant="outline-warning"
        onClick={handleClear}
        disabled={isRecording}
      >
        <BsTrash /> Clear
      </Button>
      
      <Form.Check
        type="switch"
        id="auto-stop-switch"
        label="Auto-stop"
        checked={autoStop}
        onChange={(e) => setAutoStop(e.target.checked)}
        className="text-light"
      />
      
      <Badge bg={isRecording ? 'danger' : 'secondary'}>
        {isRecording ? (autoStop ? 'Waiting for strike...' : 'Recording...') : 'Ready'}
      </Badge>
    </div>
  );
};

export default RecordingControls;