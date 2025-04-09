import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface DataPoint {
  dimension: string;
  value: number;
  color: string;
}

export interface TensorRadarChartProps {
  data: DataPoint[];
  size?: number;
  title?: string;
  subtitle?: string;
  pulseEffect?: boolean;
  animationSpeed?: number;
  className?: string;
}

const TensorRadarChart: React.FC<TensorRadarChartProps> = ({
  data,
  size = 300,
  title,
  subtitle,
  pulseEffect = true,
  animationSpeed = 1,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const scaleRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  
  // Make sure we have at least 3 dimensions to create a polygon
  const chartData = data.length < 3 ? [...data, ...Array(3 - data.length).fill({
    dimension: 'Dimension',
    value: 0.5,
    color: '#3b82f6'
  })] : data;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup for high-DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    
    // Store current time for animations
    let lastTime = 0;
    
    const render = (timestamp: number) => {
      if (!ctx) return;
      
      // Calculate delta time
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Update time reference for animations
      timeRef.current += deltaTime * 0.001 * animationSpeed;
      
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Draw the radar chart
      drawRadarChart(ctx);
      
      // Animation effect - 'breathe' the chart in and out
      if (pulseEffect) {
        scaleRef.current = 0.95 + Math.sin(timeRef.current * 0.5) * 0.05;
      } else {
        scaleRef.current = 1;
      }
      
      rafRef.current = requestAnimationFrame(render);
    };
    
    // Start the animation
    rafRef.current = requestAnimationFrame(render);
    
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [size, data, pulseEffect, animationSpeed]);
  
  const drawRadarChart = (ctx: CanvasRenderingContext2D) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = (size / 2) * 0.8 * scaleRef.current; // Leave some padding
    
    const numDimensions = chartData.length;
    const angleStep = (Math.PI * 2) / numDimensions;
    
    // Draw the radar grid
    drawGrid(ctx, centerX, centerY, maxRadius, numDimensions, angleStep);
    
    // Draw the data points and filled area
    drawDataPolygon(ctx, centerX, centerY, maxRadius, numDimensions, angleStep);
    
    // Draw dimension labels
    drawLabels(ctx, centerX, centerY, maxRadius, numDimensions, angleStep);
    
    // Draw the center point
    drawCenterPoint(ctx, centerX, centerY);
  };
  
  const drawGrid = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    maxRadius: number, 
    numDimensions: number, 
    angleStep: number
  ) => {
    // Draw concentric circles
    const numCircles = 4;
    for (let i = 1; i <= numCircles; i++) {
      const radius = (maxRadius * i) / numCircles;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Draw lines from center to corners
    for (let i = 0; i < numDimensions; i++) {
      const angle = i * angleStep - Math.PI / 2; // Start from top (negative PI/2)
      const x = centerX + maxRadius * Math.cos(angle);
      const y = centerY + maxRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };
  
  const drawDataPolygon = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    maxRadius: number, 
    numDimensions: number, 
    angleStep: number
  ) => {
    // Draw filled polygon for data
    ctx.beginPath();
    
    const time = timeRef.current;
    
    for (let i = 0; i < numDimensions; i++) {
      const dataPoint = chartData[i];
      const angle = i * angleStep - Math.PI / 2; // Start from top (negative PI/2)
      
      // Add subtle animation to data points
      const animatedValue = dataPoint.value + Math.sin(time * 2 + i) * 0.03;
      const radius = maxRadius * Math.max(0.1, Math.min(1, animatedValue));
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    // Close the path
    ctx.closePath();
    
    // Fill with gradient
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius
    );
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Draw stroke around the polygon
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw data points with their specific colors
    for (let i = 0; i < numDimensions; i++) {
      const dataPoint = chartData[i];
      const angle = i * angleStep - Math.PI / 2;
      
      // Add subtle animation to data points
      const animatedValue = dataPoint.value + Math.sin(time * 2 + i) * 0.03;
      const radius = maxRadius * Math.max(0.1, Math.min(1, animatedValue));
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Draw glowing point
      const glowSize = 4 + Math.sin(time * 3 + i * 0.7) * 2;
      
      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, glowSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = `${dataPoint.color}40`; // Color with 25% opacity
      ctx.fill();
      
      // Inner glow
      ctx.beginPath();
      ctx.arc(x, y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = `${dataPoint.color}80`; // Color with 50% opacity
      ctx.fill();
      
      // Core point
      ctx.beginPath();
      ctx.arc(x, y, glowSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = dataPoint.color;
      ctx.fill();
      
      // Value indicator
      ctx.font = '10px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Position the value indicators slightly away from the data point
      const valueAngle = angle;
      const valueDistance = radius + 12;
      const valueX = centerX + valueDistance * Math.cos(valueAngle);
      const valueY = centerY + valueDistance * Math.sin(valueAngle);
      
      // Create a small background for the value
      const valueText = (dataPoint.value * 100).toFixed(0);
      const textWidth = ctx.measureText(valueText).width;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.roundRect(valueX - textWidth / 2 - 4, valueY - 8, textWidth + 8, 16, 4);
      ctx.fill();
      
      ctx.fillStyle = dataPoint.color;
      ctx.fillText(valueText, valueX, valueY);
    }
  };
  
  const drawLabels = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    maxRadius: number, 
    numDimensions: number, 
    angleStep: number
  ) => {
    ctx.font = '12px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < numDimensions; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const labelDistance = maxRadius + 25;
      const x = centerX + labelDistance * Math.cos(angle);
      const y = centerY + labelDistance * Math.sin(angle);
      
      // Draw dimension name
      const dimensionName = chartData[i].dimension;
      
      // Adjust text alignment based on position around the circle
      if (angle > Math.PI / 4 && angle < Math.PI * 3 / 4) {
        // Bottom half
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
      } else if (angle >= Math.PI * 3 / 4 && angle < Math.PI * 5 / 4) {
        // Left half
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
      } else if (angle >= Math.PI * 5 / 4 && angle < Math.PI * 7 / 4) {
        // Top half
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
      } else {
        // Right half
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
      }
      
      ctx.fillText(dimensionName, x, y);
    }
  };
  
  const drawCenterPoint = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number
  ) => {
    // Draw center glow
    const time = timeRef.current;
    const glowSize = 8 + Math.sin(time * 2) * 3;
    
    // Outer glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, glowSize * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fill();
    
    // Middle glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.fill();
    
    // Inner glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, glowSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.fill();
    
    // Center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {title && (
        <motion.h4 
          className="text-lg font-medium text-center mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h4>
      )}
      
      {subtitle && (
        <motion.div 
          className="text-xs opacity-70 mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.div>
      )}
      
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <canvas 
          ref={canvasRef} 
          width={size} 
          height={size} 
          style={{ width: `${size}px`, height: `${size}px` }}
          className="radar-canvas"
        />
      </motion.div>
    </div>
  );
};

export default TensorRadarChart;