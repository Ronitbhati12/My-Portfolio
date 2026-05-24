import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function ShapeShiftingCursor() {
  const [cursorState, setCursorState] = useState('default');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Faster, snappier physics for a highly responsive feel
  const springConfig = { damping: 20, stiffness: 400, mass: 0.3 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      
      // Add the class 'premium-target' to your subscription buttons
      if (target.closest('.premium-target')) {
        setCursorState('premium');
      } else if (target.closest('a') || target.closest('button') || target.closest('.interactive')) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // The Magic: Morphing states
  const variants = {
    default: {
      width: 14,
      height: 14,
      backgroundColor: '#D4AF37', // Solid Gold
      borderRadius: '2px', // Sharp edges
      rotate: 45, // Turns the square into a Diamond
      border: '0px solid transparent',
    },
    hover: {
      width: 50,
      height: 50,
      backgroundColor: 'rgba(212, 175, 55, 0)', // Transparent
      borderRadius: '50%', // Morphs into a circle
      rotate: 90, 
      border: '1.5px solid #D4AF37',
    },
    premium: {
      width: 130,
      height: 36,
      backgroundColor: '#0a0a0a', // Deep sleek black
      borderRadius: '18px', // Morphs into a Pill
      rotate: 0, // Flattens out
      border: '1px solid #D4AF37',
    }
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: cursorXSpring,
        y: cursorYSpring,
        pointerEvents: 'none',
        zIndex: 10000,
      }}
    >
      <motion.div
        variants={variants}
        initial="default"
        animate={cursorState}
        // Using tween with backOut for a satisfying "snap" when changing shapes
        transition={{ type: 'tween', ease: "backOut", duration: 0.35 }} 
        style={{
          x: "-50%",
          y: "-50%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: cursorState === 'premium' ? '0px 10px 30px rgba(212, 175, 55, 0.3)' : 'none'
        }}
      >
        {/* The text that only appears in the Premium pill state */}
        <AnimatePresence>
          {cursorState === 'premium' && (
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              style={{
                color: '#D4AF37',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              Unlock Pro
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}