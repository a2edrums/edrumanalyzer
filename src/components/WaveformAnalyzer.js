import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { analyzeWaveform } from '../utils/waveformAnalysis';

const WaveformAnalyzer = ({ audioData, isRecording, onAnalysisResults }) => {
  const [analysis, setAnalysis] = useState(null);
  const lastAnalyzedData = useRef(null);

  useEffect(() => {
    if (audioData && audioData.length > 0 && !isRecording && audioData !== lastAnalyzedData.current) {
      const result = analyzeWaveform(audioData);
      setAnalysis(result);
      lastAnalyzedData.current = audioData;
      if (onAnalysisResults) {
        onAnalysisResults(result);
      }
    }
  }, [audioData, isRecording, onAnalysisResults]);

  if (!analysis) {
    return (
      <Card bg="dark" text="light">
        <Card.Body>
          <Card.Title>Waveform Analysis</Card.Title>
          <p className="text-muted">Record a drum strike to see analysis results</p>
        </Card.Body>
      </Card>
    );
  }

  const getQualityVariant = (quality) => {
    switch (quality) {
      case 'Good': return 'success';
      case 'Fair': return 'warning';
      case 'Poor': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Card bg="dark" text="light">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          Waveform Analysis
          <Badge bg={getQualityVariant(analysis.quality)}>
            {analysis.quality} Signal
          </Badge>
        </Card.Title>
        
        <Row>
          <Col md={6}>
            <Card bg="secondary" className="mb-3">
              <Card.Body>
                <Card.Subtitle>Amplitude</Card.Subtitle>
                <div className="mt-2">
                  <div>Peak: <strong>{(analysis.amplitude.max * 100).toFixed(1)}%</strong></div>
                  <div>Average: <strong>{(analysis.amplitude.average * 100).toFixed(1)}%</strong></div>
                  <div>RMS: <strong>{(analysis.amplitude.rms * 100).toFixed(1)}%</strong></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card bg="secondary" className="mb-3">
              <Card.Body>
                <Card.Subtitle>Timing</Card.Subtitle>
                <div className="mt-2">
                  <div>Attack: <strong>{analysis.attackTime} samples</strong></div>
                  <div>Decay: <strong>{analysis.decayTime} samples</strong></div>
                  <div>Peaks Found: <strong>{analysis.peaks.length}</strong></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Card bg="secondary" className="mb-3">
              <Card.Body>
                <Card.Subtitle>Signal Quality</Card.Subtitle>
                <div className="mt-2">
                  <div>Noise Floor: <strong>{(analysis.noiseFloor * 100).toFixed(2)}%</strong></div>
                  <div>S/N Ratio: <strong>{analysis.signalToNoise.toFixed(1)}:1</strong></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card bg="secondary" className="mb-3">
              <Card.Body>
                <Card.Subtitle>Dynamic Range</Card.Subtitle>
                <div className="mt-2">
                  <div>Range: <strong>{(analysis.dynamicRange * 100).toFixed(1)}%</strong></div>
                  <div>Quality: <Badge bg={getQualityVariant(analysis.quality)}>{analysis.quality}</Badge></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default WaveformAnalyzer;