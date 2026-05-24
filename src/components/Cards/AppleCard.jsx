import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function AppleCard({ children, className = '', style = {}, tilt = true, glow = true }) {
  const cardRef = useRef(null);

  // Mouse positions for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for buttery tilt rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { damping: 25, stiffness: 250 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 25, stiffness: 250 });

  // Spotlight glare mouse movement tracking (using custom properties)
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative mouse position within card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates from -0.5 to 0.5
    if (tilt) {
      x.set((mouseX / width) - 0.5);
      y.set((mouseY / height) - 0.5);
    }
    
    // Set custom properties directly on the element for optimal performance (bypasses React renders)
    if (glow) {
      cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
      cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
    }
  };

  const handleMouseLeave = () => {
    if (tilt) {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <div
      className={`apple-card-glow-container ${className}`}
      style={{
        perspective: 1000,
        ...style
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: tilt ? rotateX : 0,
          rotateY: tilt ? rotateY : 0,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="glow-card interactive"
      >
        <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
