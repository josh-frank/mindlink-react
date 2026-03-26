import { useRef, useEffect, useState } from 'react';
import MeterScale from './MeterScale';

const Meter = ({
  value = 50,
  min = 0,
  max = 100,
  startAngle = 180,
  endAngle = 0,
  numMarks = 11,
  highlightEveryNth = 2,
  viewbox = '-45 -45 90 90',
  MeterScaleComponent = MeterScale
}) => {
  // Calculate target needle angle based on value
  const normalizedValue = (value - min) / (max - min);
  const targetAngle = startAngle + (normalizedValue * (endAngle - startAngle));
  
  // Animation state
  const [currentAngle, setCurrentAngle] = useState(targetAngle);
  const currentAngleRef = useRef(targetAngle);
  const velocityRef = useRef(0);
  const animationRef = useRef(null);
  const lastTargetRef = useRef(targetAngle);

  // Physics-based needle animation
  useEffect(() => {
    const animate = () => {
      const current = currentAngleRef.current;
      const target = targetAngle;
      const velocity = velocityRef.current;
      
      // Calculate delta from target
      const delta = target - current;
      
      // Physics constants (adjust these for different feel)
      const springStrength = 0.0325;  // How strong the pull toward target is
      const damping = 0.925;         // How quickly oscillation dies down
      const minVelocity = 0.01;     // Stop animating when velocity is tiny
      
      // Spring physics: acceleration toward target
      const acceleration = delta * springStrength;
      
      // Update velocity and apply damping
      velocityRef.current = (velocity + acceleration) * damping;
      
      // Update position
      const newPosition = current + velocityRef.current;
      
      // Boundary collision detection (the "pegs"!)
      const minBoundary = startAngle;
      const maxBoundary = endAngle;
      
      if (newPosition < minBoundary) {
        // Hit the left peg! CLANK!
        currentAngleRef.current = minBoundary;
        velocityRef.current = Math.abs(velocityRef.current) * 0.6; // Bounce back with energy loss
      } else if (newPosition > maxBoundary) {
        // Hit the right peg! CLANK!
        currentAngleRef.current = maxBoundary;
        velocityRef.current = -Math.abs(velocityRef.current) * 0.6; // Bounce back with energy loss
      } else {
        // Normal movement, no collision
        currentAngleRef.current = newPosition;
      }
      
      setCurrentAngle(currentAngleRef.current);
      
      // Continue animating if we're still moving significantly
      if (Math.abs(velocityRef.current) > minVelocity || Math.abs(delta) > 0.1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation if target changed
    if (targetAngle !== lastTargetRef.current) {
      lastTargetRef.current = targetAngle;
      
      // Add initial velocity boost based on how big the change is
      const deltaChange = targetAngle - currentAngleRef.current;
      const boostFactor = Math.min(Math.abs(deltaChange) * 0.0125, 2); // Bigger changes = more initial velocity
      velocityRef.current += deltaChange * 0.125 * boostFactor;
      
      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Start the animation
      animationRef.current = requestAnimationFrame(animate);
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetAngle, startAngle, endAngle]);

  const needleAngle = currentAngle;

  return <svg
    viewBox={viewbox}
    style={{width: '100%', height: '100%', zIndex: -1, position: 'relative'}}
    preserveAspectRatio="xMidYMid meet"
  >

    {/* Scale and arc */}
    <MeterScaleComponent
      min={min}
      max={max}
      startAngle={startAngle}
      endAngle={endAngle}
      numMarks={numMarks}
      highlightEveryNth={highlightEveryNth}
    />

    {/* Current value display */}
    {/* <text
      x="0"
      y="15"
      textAnchor="middle"
      fontSize="8"
      fill="#2c3e50"
      fontWeight="bold"
    >
      {(min + ((currentAngle - startAngle) / (endAngle - startAngle)) * (max - min)).toFixed(1)}
    </text> */}

    {/* Needle */}
    <path
      d='m -1 0 l 1 -30 l 1 30 z'
      fill='#c0392b'
      style={{
        transformOrigin: '0 0',
        transform: `rotate(${needleAngle}deg)`,
      }}
    />
    
    {/* Needle tip */}
    <circle 
      cx="0" 
      cy="-30" 
      r="1.25" 
      fill="#c0392b"
      style={{
        transformOrigin: '0 0',
        transform: `rotate(${needleAngle}deg)`,
      }}
    />

    {/* Center pivot */}
    <circle cx="0" cy="0" r="2" fill="#2c3e50" style={{ zIndex: 1 }} className="pivot" />
  </svg>
};

export default Meter;