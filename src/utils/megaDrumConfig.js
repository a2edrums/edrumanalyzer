// MegaDrum Configuration based on official documentation

export const calculateThreshold = (peakAmplitude, noiseFloor) => {
  // Threshold: Sets minimum signal level to trigger (typically 1-100+ range)
  const baseThreshold = Math.max(noiseFloor * 4, 0.05);
  const maxThreshold = peakAmplitude * 0.4;
  const normalizedThreshold = Math.min(baseThreshold, maxThreshold);
  return Math.max(1, Math.round(normalizedThreshold * 100));
};

export const recommendGain = (amplitude) => {
  // Gain: 0-8 range for input amplification
  if (amplitude < 0.1) return { value: 8, description: 'Maximum gain for weak signals' };
  if (amplitude < 0.25) return { value: 6, description: 'High gain for moderate signals' };
  if (amplitude < 0.5) return { value: 4, description: 'Medium gain for good signals' };
  if (amplitude < 0.75) return { value: 2, description: 'Low gain for strong signals' };
  return { value: 0, description: 'No gain for very strong signals' };
};

export const recommendHighLevel = (amplitude) => {
  // HighLevel: Signal level for maximum velocity (200-1023 range)
  const level = Math.round(amplitude * 1023);
  return Math.max(200, Math.min(1023, level));
};

export const recommendMinScan = (attackTime, sampleRate = 44100) => {
  // MinScan: 1-100 (0.1-10ms) - time to scan for peak
  const attackTimeMs = (attackTime / sampleRate) * 1000;
  if (attackTimeMs < 1) return { value: 10, description: '1ms - Fast attack (cymbals)' };
  if (attackTimeMs < 3) return { value: 20, description: '2ms - Medium attack (snare, toms)' };
  if (attackTimeMs < 6) return { value: 30, description: '3ms - Slower attack' };
  return { value: 50, description: '5ms - Slow attack (kick, mesh)' };
};

export const recommendRetrigger = (peaks) => {
  // Retrigger: 4-50ms period between hits
  if (peaks.length <= 1) return { value: 4, description: '4ms - Fast response' };
  if (peaks.length <= 3) return { value: 8, description: '8ms - Standard retrigger' };
  if (peaks.length <= 5) return { value: 12, description: '12ms - Slower retrigger' };
  return { value: 20, description: '20ms - Prevent false triggers' };
};

export const recommendDynLevel = (signalToNoise) => {
  // DynLevel: 0-15 dynamic threshold level
  if (signalToNoise > 15) return { value: 5, description: 'Low suppression for clean signals' };
  if (signalToNoise > 10) return { value: 8, description: 'Medium suppression' };
  if (signalToNoise > 5) return { value: 12, description: 'High suppression' };
  return { value: 15, description: 'Maximum suppression for noisy signals' };
};

export const recommendDynTime = (decayTime, sampleRate = 44100) => {
  // DynTime: 8-60ms dynamic threshold decay time
  const decayTimeMs = (decayTime / sampleRate) * 1000;
  if (decayTimeMs < 10) return { value: 8, description: '8ms - Fast decay (rubber pads)' };
  if (decayTimeMs < 20) return { value: 15, description: '15ms - Medium decay' };
  if (decayTimeMs < 40) return { value: 25, description: '25ms - Slow decay' };
  return { value: 40, description: '40ms - Very slow decay (mesh pads)' };
};

export const recommendXtalk = (signalToNoise) => {
  // Xtalk: 0-7 crosstalk suppression
  if (signalToNoise > 15) return { value: 0, description: 'No crosstalk suppression' };
  if (signalToNoise > 10) return { value: 2, description: 'Low crosstalk suppression' };
  if (signalToNoise > 5) return { value: 4, description: 'Medium crosstalk suppression' };
  return { value: 6, description: 'High crosstalk suppression' };
};

export const recommendCurve = (dynamicRange) => {
  // Curve: Linear, Log1-3, Exp1-2, S1-2, Strong1-2, Max
  if (dynamicRange < 0.3) return 'Linear';
  if (dynamicRange < 0.5) return 'Log1';
  if (dynamicRange < 0.7) return 'Log2';
  return 'Log3';
};

export const recommendComprLvl = (amplitude) => {
  // ComprLvl: 0-7 compression level
  if (amplitude.max < 0.4) return { value: 0, description: 'No compression' };
  if (amplitude.max < 0.6) return { value: 2, description: 'Light compression' };
  if (amplitude.max < 0.8) return { value: 4, description: 'Medium compression' };
  return { value: 6, description: 'Heavy compression' };
};

export const detectPadType = (analysisResults) => {
  const { attackTime, decayTime, amplitude } = analysisResults;
  const ratio = decayTime / (attackTime + 1);
  
  if (attackTime < 3 && ratio > 8) return 'Cymbal';
  if (attackTime < 5 && amplitude.max > 0.6) return 'Snare';
  if (attackTime > 10 && decayTime > 20) return 'Kick';
  if (attackTime < 8 && ratio < 4) return 'Tom';
  return 'Generic Pad';
};

export const generateConfig = (analysisResults, overridePadType = null) => {
  if (!analysisResults) return null;
  
  const {
    amplitude,
    noiseFloor,
    dynamicRange,
    signalToNoise,
    attackTime,
    decayTime,
    peaks,
    quality
  } = analysisResults;
  
  const detectedType = detectPadType(analysisResults);
  const padType = overridePadType || detectedType;
  const threshold = calculateThreshold(amplitude.max, noiseFloor);
  const gain = recommendGain(amplitude.max);
  const minScan = recommendMinScan(attackTime);
  const retrigger = recommendRetrigger(peaks);
  const dynLevel = recommendDynLevel(signalToNoise);
  const dynTime = recommendDynTime(decayTime);
  const xtalk = recommendXtalk(signalToNoise);
  const curve = recommendCurve(dynamicRange);
  const comprLvl = recommendComprLvl(amplitude);
  
  return {
    padType,
    detectedType,
    coreSettings: {
      threshold: { value: threshold, range: '1-100+', description: 'Minimum signal level to trigger' },
      gain: { value: gain.value, range: '0-8', description: gain.description },
      highLevel: { value: recommendHighLevel(amplitude.max), range: '200-1023', description: 'Signal level for max velocity' }
    },
    timingSettings: {
      minScan: { value: minScan.value, range: '1-100 (0.1-10ms)', description: minScan.description },
      retrigger: { value: retrigger.value, range: '4-50ms', description: retrigger.description },
      dynLevel: { value: dynLevel.value, range: '0-15', description: dynLevel.description },
      dynTime: { value: dynTime.value, range: '8-60ms', description: dynTime.description }
    },
    dynamicsSettings: {
      curve: { value: curve, range: 'Linear/Log/Exp/S/Strong/Max', description: 'Velocity response curve' },
      comprLvl: { value: comprLvl.value, range: '0-7', description: comprLvl.description }
    },
    advancedSettings: {
      xtalk: { value: xtalk.value, range: '0-7', description: xtalk.description }
    },
    quality,
    recommendations: {
      general: [
        `Detected pad type: ${padType}`,
        'Use HiLvlAuto initially to find optimal HighLevel',
        'Set Threshold above noise floor but allow soft hits',
        'Adjust MinScan based on pad type (rubber vs mesh)'
      ],
      specific: getSpecificRecommendations(analysisResults),
      setup: [
        'Navigation: Main Menu → Pads → Select Input',
        'Enable HiLvlAuto initially for guidance',
        'Test with various hit strengths to verify velocity range',
        'Use Big VU Meter for precise level monitoring',
        'Save configuration when satisfied with settings'
      ]
    }
  };
};

const getSpecificRecommendations = (analysis) => {
  const recommendations = [];
  
  if (analysis.amplitude.max > 0.9) {
    recommendations.push('Signal clipping - reduce Gain or use voltage divider');
  } else if (analysis.amplitude.max > 0.8) {
    recommendations.push('Very hot signal - consider reducing Gain');
  }
  
  if (analysis.amplitude.max < 0.1) {
    recommendations.push('Weak signal - increase Gain or check connections');
  }
  
  if (analysis.peaks.length > 5) {
    recommendations.push('Multiple peaks detected - increase Retrigger time');
    recommendations.push('Check for loose hardware or vibrations');
  }
  
  if (analysis.signalToNoise < 3) {
    recommendations.push('High noise - increase Threshold and Xtalk settings');
    recommendations.push('Use shielded cables and proper grounding');
  }
  
  if (analysis.dynamicRange < 0.2) {
    recommendations.push('Limited dynamics - adjust HighLevel for better range');
  }
  
  return recommendations;
};