import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Badge } from 'react-bootstrap';
import { BsMic, BsMicMute } from 'react-icons/bs';
import { getAudioDevices, startAudioCapture, stopAudioCapture } from '../utils/audioUtils';

const AudioSourceSelector = ({ onDeviceChange, onConnectionChange }) => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const audioDevices = await getAudioDevices();
    setDevices(audioDevices);
  };

  const handleDeviceSelect = async (device) => {
    setIsLoading(true);
    setSelectedDevice(device);
    
    if (isConnected) {
      stopAudioCapture();
    }
    
    const success = await startAudioCapture(device.deviceId);
    setIsConnected(success);
    
    if (onDeviceChange) onDeviceChange(device);
    if (onConnectionChange) onConnectionChange(success);
    
    setIsLoading(false);
  };

  const handleDisconnect = () => {
    stopAudioCapture();
    setIsConnected(false);
    setSelectedDevice(null);
    if (onConnectionChange) onConnectionChange(false);
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <Dropdown>
        <Dropdown.Toggle variant="outline-light" disabled={isLoading}>
          {selectedDevice ? selectedDevice.label || 'Unknown Device' : 'Select Audio Input'}
        </Dropdown.Toggle>
        <Dropdown.Menu variant="dark">
          {devices.map((device) => (
            <Dropdown.Item
              key={device.deviceId}
              onClick={() => handleDeviceSelect(device)}
            >
              {device.label || `Device ${device.deviceId.slice(0, 8)}...`}
            </Dropdown.Item>
          ))}
          {devices.length === 0 && (
            <Dropdown.Item disabled>No audio devices found</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
      
      {isConnected && (
        <Button variant="outline-danger" size="sm" onClick={handleDisconnect}>
          <BsMicMute /> Disconnect
        </Button>
      )}
      
      <Badge bg={isConnected ? 'success' : 'secondary'}>
        {isConnected ? <BsMic /> : <BsMicMute />}
        {isConnected ? 'Connected' : 'Disconnected'}
      </Badge>
    </div>
  );
};

export default AudioSourceSelector;