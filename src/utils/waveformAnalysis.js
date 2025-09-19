export const findPeaks = (audioData, threshold = 0.3) => {
  const peaks = [];
  const normalizedData = audioData.map(val => (val - 128) / 128);
  
  for (let i = 1; i < normalizedData.length - 1; i++) {
    if (
      Math.abs(normalizedData[i]) > threshold &&
      Math.abs(normalizedData[i]) > Math.abs(normalizedData[i - 1]) &&
      Math.abs(normalizedData[i]) > Math.abs(normalizedData[i + 1])
    ) {
      peaks.push({
        index: i,
        amplitude: Math.abs(normalizedData[i]),
        value: normalizedData[i]
      });
    }
  }
  
  return peaks.sort((a, b) => b.amplitude - a.amplitude);
};

export const calculateAmplitude = (audioData) => {
  const normalizedData = audioData.map(val => Math.abs((val - 128) / 128));
  const maxAmplitude = Math.max(...normalizedData);
  const avgAmplitude = normalizedData.reduce((sum, val) => sum + val, 0) / normalizedData.length;
  
  return {
    max: maxAmplitude,
    average: avgAmplitude,
    rms: Math.sqrt(normalizedData.reduce((sum, val) => sum + val * val, 0) / normalizedData.length)
  };
};

export const calculateAttackTime = (audioData, peakIndex) => {
  if (!peakIndex) return 0;
  
  const normalizedData = audioData.map(val => (val - 128) / 128);
  const peakValue = Math.abs(normalizedData[peakIndex]);
  const threshold = peakValue * 0.1; // 10% of peak
  
  // Find start of attack (working backwards from peak)
  let attackStart = peakIndex;
  for (let i = peakIndex; i >= 0; i--) {
    if (Math.abs(normalizedData[i]) < threshold) {
      attackStart = i;
      break;
    }
  }
  
  // Attack time in samples (convert to ms if needed)
  return peakIndex - attackStart;
};

export const calculateDecayTime = (audioData, peakIndex) => {
  if (!peakIndex) return 0;
  
  const normalizedData = audioData.map(val => (val - 128) / 128);
  const peakValue = Math.abs(normalizedData[peakIndex]);
  const threshold = peakValue * 0.1; // 10% of peak
  
  // Find end of decay (working forwards from peak)
  let decayEnd = peakIndex;
  for (let i = peakIndex; i < normalizedData.length; i++) {
    if (Math.abs(normalizedData[i]) < threshold) {
      decayEnd = i;
      break;
    }
  }
  
  // Decay time in samples
  return decayEnd - peakIndex;
};

export const estimateNoiseFloor = (audioData) => {
  const normalizedData = audioData.map(val => Math.abs((val - 128) / 128));
  
  // Sort and take bottom 20% as noise floor estimate
  const sorted = [...normalizedData].sort((a, b) => a - b);
  const noiseFloorSamples = sorted.slice(0, Math.floor(sorted.length * 0.2));
  
  return noiseFloorSamples.reduce((sum, val) => sum + val, 0) / noiseFloorSamples.length;
};

export const analyzeWaveform = (audioData) => {
  if (!audioData || audioData.length === 0) {
    return null;
  }
  
  const peaks = findPeaks(audioData);
  const amplitude = calculateAmplitude(audioData);
  const noiseFloor = estimateNoiseFloor(audioData);
  
  const mainPeak = peaks[0];
  const attackTime = mainPeak ? calculateAttackTime(audioData, mainPeak.index) : 0;
  const decayTime = mainPeak ? calculateDecayTime(audioData, mainPeak.index) : 0;
  
  const signalToNoise = amplitude.max / (noiseFloor || 0.001);
  const dynamicRange = amplitude.max - amplitude.average;
  
  return {
    peaks,
    amplitude,
    noiseFloor,
    attackTime,
    decayTime,
    signalToNoise,
    dynamicRange,
    quality: signalToNoise > 10 ? 'Good' : signalToNoise > 5 ? 'Fair' : 'Poor'
  };
};