const fs = require('fs');
const path = require('path');

function generateClickWav() {
  const sampleRate = 44100;
  const duration = 0.05; // 50ms
  const numSamples = Math.floor(sampleRate * duration);
  
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4); // File size - 8
  buffer.write('WAVE', 8);
  
  // Format chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // Mono (1 channel)
  buffer.writeUInt32LE(sampleRate, 24); // Sample rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  buffer.writeUInt16LE(2, 32); // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample
  
  // Data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40); // Data chunk size
  
  // Write sine wave decaying exponentially
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 600 * Math.exp(-t * 40); // Frequency sweep from 600Hz down
    const amp = 0.4 * Math.exp(-t * 60);  // Volume decay
    const val = Math.sin(2 * Math.PI * freq * t) * amp;
    
    // Scale to 16-bit signed integer
    const intVal = Math.floor(val * 32767);
    buffer.writeInt16LE(intVal, 44 + i * 2);
  }
  
  const destDir = path.join(__dirname, 'apps', 'web', 'public');
  if (!fs.existsSync(destDir)){
      fs.mkdirSync(destDir, { recursive: true });
  }
  
  const destPath = path.join(destDir, 'click.wav');
  fs.writeFileSync(destPath, buffer);
  console.log(`Successfully generated WAV click sound at ${destPath}`);
}

generateClickWav();
