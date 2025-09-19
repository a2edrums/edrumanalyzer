import React, { useState, useEffect } from 'react';
import { Card, Alert, Button, Row, Col, Accordion, Form } from 'react-bootstrap';
import { BsCopy, BsCheck, BsGear, BsClock, BsSliders, BsShield } from 'react-icons/bs';
import { generateConfig } from '../utils/megaDrumConfig';

const MegaDrumGuidance = ({ analysisResults }) => {
  const [config, setConfig] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedPadType, setSelectedPadType] = useState('');

  useEffect(() => {
    if (analysisResults) {
      const megaDrumConfig = generateConfig(analysisResults, selectedPadType);
      setConfig(megaDrumConfig);
      if (!selectedPadType) {
        setSelectedPadType(megaDrumConfig.padType);
      }
    }
  }, [analysisResults, selectedPadType]);

  const handlePadTypeChange = (e) => {
    setSelectedPadType(e.target.value);
  };

  const handleCopyConfig = () => {
    if (!config) return;
    
    const configText = `MegaDrum Configuration for ${config.padType}
${'='.repeat(50)}

CORE SETTINGS:
Threshold: ${config.coreSettings.threshold.value} (${config.coreSettings.threshold.range})
Gain: ${config.coreSettings.gain.value} (${config.coreSettings.gain.range})
HighLevel: ${config.coreSettings.highLevel.value} (${config.coreSettings.highLevel.range})

TIMING SETTINGS:
MinScan: ${config.timingSettings.minScan.value} (${config.timingSettings.minScan.range})
Retrigger: ${config.timingSettings.retrigger.value}ms (${config.timingSettings.retrigger.range})
DynLevel: ${config.timingSettings.dynLevel.value} (${config.timingSettings.dynLevel.range})
DynTime: ${config.timingSettings.dynTime.value}ms (${config.timingSettings.dynTime.range})

DYNAMICS SETTINGS:
Curve: ${config.dynamicsSettings.curve.value} (${config.dynamicsSettings.curve.range})
ComprLvl: ${config.dynamicsSettings.comprLvl.value} (${config.dynamicsSettings.comprLvl.range})

ADVANCED SETTINGS:
Xtalk: ${config.advancedSettings.xtalk.value} (${config.advancedSettings.xtalk.range})

SIGNAL QUALITY: ${config.quality}

GENERAL RECOMMENDATIONS:
${config.recommendations.general.map(rec => `• ${rec}`).join('\n')}

SPECIFIC RECOMMENDATIONS:
${config.recommendations.specific.map(rec => `• ${rec}`).join('\n')}

SETUP GUIDE:
${config.recommendations.setup.map(rec => `• ${rec}`).join('\n')}`;
    
    navigator.clipboard.writeText(configText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!config) {
    return (
      <Card bg="dark" text="light">
        <Card.Body>
          <Card.Title>MegaDrum Configuration</Card.Title>
          <p className="text-muted">Analyze a drum strike to get configuration recommendations</p>
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>MegaDrum Configuration</Card.Title>
          <Button
            variant="outline-light"
            size="sm"
            onClick={handleCopyConfig}
            disabled={copied}
          >
            {copied ? <BsCheck /> : <BsCopy />}
            {copied ? 'Copied!' : 'Copy Config'}
          </Button>
        </div>
        
        <Alert variant={getQualityVariant(config.quality)} className="mb-3">
          <Row className="align-items-center">
            <Col md={6}>
              <div>
                <strong>Detected: {config.detectedType}</strong>
                <div className="small">Signal Quality: {config.quality}</div>
              </div>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small mb-1">Optimize for:</Form.Label>
                <Form.Select size="sm" value={selectedPadType} onChange={handlePadTypeChange}>
                  <option value="Cymbal">Cymbal</option>
                  <option value="Snare">Snare</option>
                  <option value="Kick">Kick</option>
                  <option value="Tom">Tom</option>
                  <option value="Generic Pad">Generic Pad</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Alert>
        
        <Accordion defaultActiveKey="0" className="mb-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <BsGear className="me-2" /> Core Settings
            </Accordion.Header>
            <Accordion.Body className="bg-dark">
              <Row>
                <Col md={4}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>Threshold:</small>
                        <strong>{config.coreSettings.threshold.value}</strong>
                      </div>
                      <small className="text-muted">{config.coreSettings.threshold.range}</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>Gain:</small>
                        <strong>{config.coreSettings.gain.value}</strong>
                      </div>
                      <small className="text-muted">{config.coreSettings.gain.range}</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>HighLevel:</small>
                        <strong>{config.coreSettings.highLevel.value}</strong>
                      </div>
                      <small className="text-muted">{config.coreSettings.highLevel.range}</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <BsClock className="me-2" /> Timing Settings
            </Accordion.Header>
            <Accordion.Body className="bg-dark">
              <Row>
                <Col md={3}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>MinScan:</small>
                        <strong>{config.timingSettings.minScan.value}</strong>
                      </div>
                      <small className="text-muted">{config.timingSettings.minScan.description}</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>Retrigger:</small>
                        <strong>{config.timingSettings.retrigger.value}ms</strong>
                      </div>
                      <small className="text-muted">{config.timingSettings.retrigger.description}</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>DynLevel:</small>
                        <strong>{config.timingSettings.dynLevel.value}</strong>
                      </div>
                      <small className="text-muted">{config.timingSettings.dynLevel.description}</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>DynTime:</small>
                        <strong>{config.timingSettings.dynTime.value}ms</strong>
                      </div>
                      <small className="text-muted">{config.timingSettings.dynTime.description}</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <BsSliders className="me-2" /> Dynamics & Response
            </Accordion.Header>
            <Accordion.Body className="bg-dark">
              <Row>
                <Col md={6}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>Curve:</small>
                        <strong>{config.dynamicsSettings.curve.value}</strong>
                      </div>
                      <small className="text-muted">{config.dynamicsSettings.curve.range}</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>ComprLvl:</small>
                        <strong>{config.dynamicsSettings.comprLvl.value}</strong>
                      </div>
                      <small className="text-muted">{config.dynamicsSettings.comprLvl.description}</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <BsShield className="me-2" /> Advanced Settings
            </Accordion.Header>
            <Accordion.Body className="bg-dark">
              <Row>
                <Col md={6}>
                  <Card bg="secondary" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <small>Xtalk:</small>
                        <strong>{config.advancedSettings.xtalk.value}</strong>
                      </div>
                      <small className="text-muted">{config.advancedSettings.xtalk.description}</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        
        <Accordion className="mb-3">
          {config.recommendations.general.length > 0 && (
            <Accordion.Item eventKey="0">
              <Accordion.Header>General Recommendations</Accordion.Header>
              <Accordion.Body className="bg-info text-dark">
                <ul className="mb-0">
                  {config.recommendations.general.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}
          
          {config.recommendations.specific.length > 0 && (
            <Accordion.Item eventKey="1">
              <Accordion.Header>Signal-Specific Recommendations</Accordion.Header>
              <Accordion.Body className="bg-warning text-dark">
                <ul className="mb-0">
                  {config.recommendations.specific.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}
          
          {config.recommendations.setup.length > 0 && (
            <Accordion.Item eventKey="2">
              <Accordion.Header>Setup & Calibration Guide</Accordion.Header>
              <Accordion.Body className="bg-success text-dark">
                <ul className="mb-0">
                  {config.recommendations.setup.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default MegaDrumGuidance;