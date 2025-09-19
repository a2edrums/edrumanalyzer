import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { BsPlay, BsStop, BsTrash } from 'react-icons/bs';

const RecordingControls = ({ onRecordingChange, onClear, isConnected }) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleStart = () => {
    if (!isConnected) return;
    
    setIsRecording(true);
    if (onRecordingChange) onRecordingChange(true);
  };

  const handleStop = () => {
    setIsRecording(false);
    if (onRecordingChange) onRecordingChange(false);
  };

  const handleClear = () => {
    if (onClear) onClear();
  };

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
      
      <Badge bg={isRecording ? 'danger' : 'secondary'}>
        {isRecording ? 'Recording...' : 'Ready'}
      </Badge>
    </div>
  );
};

export default RecordingControls;