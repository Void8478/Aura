import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';

interface VisualizerCanvasProps {
  mode?: 'bars' | 'wave' | 'led-vu' | 'minimal-dots';
  height?: number;
  width?: number;
  barColor?: string;
  className?: string;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  mode = 'bars',
  height = 36,
  width = 120,
  barColor = '#e07a5f',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { frequencyData, isPlaying } = usePlayerStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Support Retina/HiDPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    if (mode === 'bars') {
      const numBars = 16;
      const barWidth = Math.floor(width / numBars) - 2;
      const gap = 2;

      for (let i = 0; i < numBars; i++) {
        // Fallback subtle idle movement if paused
        let val = isPlaying
          ? (frequencyData[i] || 10) / 255
          : 0.15 + Math.sin(Date.now() / 400 + i) * 0.08;

        const barHeight = Math.max(3, val * (height - 4));
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        // Gradient for depth
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, barColor);
        gradient.addColorStop(1, 'rgba(224, 122, 95, 0.3)');

        ctx.fillStyle = isPlaying ? gradient : '#3f3f4c';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();
      }
    } else if (mode === 'wave') {
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? barColor : '#565450';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const sliceWidth = width / 24;
      let x = 0;

      for (let i = 0; i < 24; i++) {
        const val = isPlaying
          ? (frequencyData[i % frequencyData.length] || 10) / 255
          : 0.2 + Math.sin(Date.now() / 500 + i * 0.5) * 0.1;

        const y = height / 2 + (val - 0.5) * height * 0.8;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
    } else if (mode === 'minimal-dots') {
      const numDots = 4;
      const dotRadius = 2.5;
      const spacing = width / (numDots + 1);

      for (let i = 0; i < numDots; i++) {
        const val = isPlaying ? (frequencyData[i * 4] || 20) / 255 : 0.2;
        const x = (i + 1) * spacing;
        const y = height / 2;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius * (isPlaying ? 0.8 + val * 0.8 : 0.8), 0, Math.PI * 2);
        ctx.fillStyle = isPlaying ? barColor : '#686675';
        ctx.fill();
      }
    } else if (mode === 'led-vu') {
      const numSegments = 10;
      const segWidth = 8;
      const segHeight = Math.floor(height / numSegments) - 1;
      const avgVolume = isPlaying
        ? frequencyData.reduce((acc, v) => acc + v, 0) / (frequencyData.length * 255)
        : 0.1;

      const activeSegments = Math.round(avgVolume * numSegments);

      for (let i = 0; i < numSegments; i++) {
        const segIndexFromBottom = numSegments - 1 - i;
        const isActive = segIndexFromBottom <= activeSegments;
        const y = i * (segHeight + 1);

        let color = '#282830';
        if (isActive) {
          if (i < 2) color = '#e07a5f'; // Peak red/terracotta
          else if (i < 5) color = '#d4a373'; // Amber
          else color = '#819875'; // Olive
        }

        ctx.fillStyle = color;
        ctx.fillRect(width / 2 - segWidth / 2, y, segWidth, segHeight);
      }
    }
  }, [frequencyData, isPlaying, mode, height, width, barColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`block ${className}`}
    />
  );
};
