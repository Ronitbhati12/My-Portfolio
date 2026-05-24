import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onLoaded }) {
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const increment = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
if (simulatedProgress === 100) {
      const timeout = setTimeout(() => {
        setIsFading(true);
      }, 500); 
      return () => clearTimeout(timeout);
    }
  }, [simulatedProgress]);

  useEffect(() => {
    if (isFading) {
      const timeout = setTimeout(() => {
        onLoaded();
      }, 1000); 
      return () => clearTimeout(timeout);
    }
  }, [isFading, onLoaded]);

  return (
    <AnimatePresence>
      {!isFading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            backgroundColor: 'var(--color-bg-deep)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-luxury)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <div style={{ position: 'relative', width: '250px', height: '1px', backgroundColor: 'rgba(63, 114, 175, 0.2)', overflow: 'hidden' }}>
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-accent-dark), var(--color-accent-base), var(--color-accent-light))',
                width: `${simulatedProgress}%`
              }}
              layout
            />
          </div>
          <div style={{ marginTop: '2rem', fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase', textAlign: 'center' }}>
            System Initialization [ {Math.round(simulatedProgress)}% ]
          </div>
          <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-accent-light)', opacity: 0.8, letterSpacing: '0.05em', fontWeight: 300, fontStyle: 'italic', textAlign: 'center', maxWidth: '350px' }}>
            "I don't chase trends.<br />I build interfaces people remember."
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
