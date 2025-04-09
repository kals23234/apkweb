import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
  direction: number;
}

const PRIMARY = "#6E44FF";
const SECONDARY = "#00D1FF";
const ACCENT = "#FF3D71";

const colors = [PRIMARY, SECONDARY, ACCENT];

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();
  const animationStartTimeRef = useRef(0);

  const createParticles = (count: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.5 + 0.1,
        direction: Math.random() * 360
      });
    }
    return particles;
  };

  useEffect(() => {
    particlesRef.current = createParticles(30);
    animationStartTimeRef.current = performance.now();
    
    // Animation cleanup when component unmounts
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="particles absolute top-0 left-0 w-full h-full overflow-hidden z-0"
    >
      {particlesRef.current.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          initial={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity
          }}
          animate={{
            y: [0, -15, -25, -10, 0],
            x: [0, 10, -5, -15, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
