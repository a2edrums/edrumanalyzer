import React, { useState, useCallback } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Layout from './components/Layout';
import AudioSourceSelector from './components/AudioSourceSelector';
import WaveformVisualizer from './components/WaveformVisualizer';
import RecordingControls from './components/RecordingControls';
import WaveformAnalyzer from './components/WaveformAnalyzer';
import MegaDrumGuidance from './components/MegaDrumGuidance';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleDeviceChange = (device) => {
    console.log('Device changed:', device);
  };

  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
    if (!connected) {
      setIsRecording(false);
      setAudioData(null);
      setAnalysisResults(null);
    }
  };

  const handleRecordingChange = (recording) => {
    setIsRecording(recording);
    if (!recording) {
      // Recording stopped - trigger analysis
      // Analysis will be handled by WaveformAnalyzer component
    }
  };

  const handleAudioData = (data) => {
    if (isRecording) {
      setAudioData(data);
    }
  };

  const handleAnalysisResults = useCallback((results) => {
    setAnalysisResults(results);
  }, []);

  const handleClear = () => {
    setAudioData(null);
    setAnalysisResults(null);
  };

  return (
    <Layout>
      <Row className="mb-4">
        <Col>
          <Card bg="dark" text="light">
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <AudioSourceSelector
                  onDeviceChange={handleDeviceChange}
                  onConnectionChange={handleConnectionChange}
                />
                <RecordingControls
                  onRecordingChange={handleRecordingChange}
                  onClear={handleClear}
                  isConnected={isConnected}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card bg="dark" text="light">
            <Card.Body>
              <Card.Title>Real-time Waveform</Card.Title>
              <WaveformVisualizer
                isRecording={isRecording}
                onAudioData={handleAudioData}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col lg={6}>
          <WaveformAnalyzer
            audioData={audioData}
            isRecording={isRecording}
            onAnalysisResults={handleAnalysisResults}
          />
        </Col>
        <Col lg={6}>
          <MegaDrumGuidance
            analysisResults={analysisResults}
          />
        </Col>
      </Row>
    </Layout>
  );
}

export default App;
