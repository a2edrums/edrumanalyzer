let audioContext = null;
let mediaStream = null;
let analyser = null;
let microphone = null;
let dataArray = null;

export const getAudioDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'audioinput');
  } catch (error) {
    console.error('Error getting audio devices:', error);
    return [];
  }
};

export const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

export const startAudioCapture = async (deviceId) => {
  try {
    const constraints = {
      audio: deviceId ? { deviceId: { exact: deviceId } } : true
    };
    
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (!audioContext) {
      initAudioContext();
    }
    
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    
    microphone = audioContext.createMediaStreamSource(mediaStream);
    microphone.connect(analyser);
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    return true;
  } catch (error) {
    console.error('Error starting audio capture:', error);
    return false;
  }
};

export const stopAudioCapture = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  if (microphone) {
    microphone.disconnect();
    microphone = null;
  }
  analyser = null;
  dataArray = null;
};

export const getAudioData = () => {
  if (analyser && dataArray) {
    analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }
  return null;
};

export const getAnalyser = () => analyser;
export const getAudioContext = () => audioContext;