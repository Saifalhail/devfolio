import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

/**
 * StarryBackground - A reusable animated starry background component
 * Can be used as a background for any section of the application
 * @param {Object} props - Component props
 * @param {string} props.color - Primary color for stars (default: white)
 * @param {number} props.starCount - Number of stars to render (default: 150)
 * @param {number} props.blurAmount - Amount of blur effect (default: 8px)
 * @param {number} props.opacity - Background opacity (default: 0.7)
 */
const StarryBackground = ({ 
  color = 'white', 
  starCount = 150, 
  blurAmount = 8,
  opacity = 0.7
}) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const stars = [];
    
    // Set canvas to full size of its container
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars(); // Reinitialize stars when canvas is resized
    };
    
    // Initialize star positions
    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.05 + 0.01,
          pulse: Math.random() * 0.1,
          pulseFactor: Math.random() * 0.02 + 0.01
        });
      }
    };
    
    // Draw stars on canvas
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        // Update star position
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
        
        // Pulsing effect
        star.pulse += star.pulseFactor;
        const pulseFactor = Math.sin(star.pulse) * 0.5 + 0.5;
        const currentRadius = star.radius * (1 + pulseFactor * 0.3);
        const currentOpacity = star.opacity * (0.7 + pulseFactor * 0.3);
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();
      });
      
      // Add occasional shooting star
      if (Math.random() < 0.01) {
        const shootingStar = {
          x: Math.random() * canvas.width,
          y: 0,
          length: Math.random() * 80 + 20,
          speed: Math.random() * 10 + 5,
          angle: Math.PI / 4 + (Math.random() * Math.PI / 4)
        };
        
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length
        );
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Continue animation
      requestAnimationFrame(drawStars);
    };
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawStars();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color, starCount]);
  
  return (
    <BackgroundContainer $opacity={opacity} $blurAmount={blurAmount}>
      <Canvas ref={canvasRef} />
    </BackgroundContainer>
  );
};

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: -1;
  opacity: ${props => props.$opacity};
  filter: blur(${props => props.$blurAmount}px);
  pointer-events: none;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

export default StarryBackground;
