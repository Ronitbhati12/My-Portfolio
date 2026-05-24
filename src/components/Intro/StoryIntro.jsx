import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function Particles() {
  const ref = useRef();
  const [sphere] = useState(() => {
    const positions = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#DBE2EF" size={0.05} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

export default function StoryIntro({ onComplete }) {
  const [phase, setPhase] = useState(() => {
    return sessionStorage.getItem('storyIntroPlayed') ? 4 : 1;
  });
  const [typewriterText, setTypewriterText] = useState('');

  const fullText = "See how boring this looks? ... no life. Let's add some frontend magic. ✦";


  // For 3D Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Increased rotation range and spring responsiveness for higher sensitivity
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [35, -35]), { damping: 20, stiffness: 400 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-35, 35]), { damping: 20, stiffness: 400 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  useEffect(() => {
    sessionStorage.setItem('storyIntroPlayed', 'true');

    let timer1, timer2, timer3, typeTimeout;
    let isCancelled = false;

    if (phase === 4) return;

    // Phase 1 -> 2
    timer1 = setTimeout(() => {
      if (isCancelled) return;
      setPhase(2);

      const parts = [
        "See how boring this looks? ",
        "... no life.",
        "\n\nLet's add some frontend magic. ✦"
      ];

      let currentText = "";

      const typePart = (partIndex) => {
        if (isCancelled) return;
        if (partIndex >= parts.length) {
          // Finished typing all parts -> Go to Phase 3
          timer2 = setTimeout(() => {
            if (isCancelled) return;
            setPhase(3);
            // Phase 3 -> 4
            timer3 = setTimeout(() => {
              if (isCancelled) return;
              setPhase(4);
            }, 100); // 100ms blackout flash
          }, 1500);
          return;
        }

        const part = parts[partIndex];
        let charIndex = 0;

        const typeChar = () => {
          if (isCancelled) return;
          if (charIndex < part.length) {
            currentText += part[charIndex];
            setTypewriterText(currentText);
            charIndex++;

            // Speed controls: slower on punctuation for emphasis
            let delay = 50;
            const prevChar = part[charIndex - 1];
            if (prevChar === '?' || (prevChar === '.' && part[charIndex] !== '.')) {
              delay = 600;
            }
            typeTimeout = setTimeout(typeChar, delay);
          } else {
            // Pause before the next part
            let pauseDelay = 800;
            if (partIndex === 1) {
              pauseDelay = 1500; // Extra long gap/pause before the magic text
            }
            typeTimeout = setTimeout(() => typePart(partIndex + 1), pauseDelay);
          }
        };

        typeChar();
      };

      typePart(0);
    }, 2000);

    return () => {
      isCancelled = true;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(typeTimeout);
    };
  }, []);

  return (
    <div
      onMouseMove={phase === 4 ? handleMouseMove : undefined}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 100,
        background: phase === 3 || phase === 4 ? 'var(--color-bg-deep)' : '#fff', // White background for boring phase
        color: phase === 3 || phase === 4 ? 'var(--color-text-luxury)' : '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: phase === 4 ? 'auto' : 'none'
      }}
    >
 <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              fontFamily: '"Times New Roman", Times, serif', 
              fontSize: '2rem',
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#Faf9f6', /* Cream background */
              color: '#0a0a0a', /* Dark text for contrast */
              zIndex: 50
            }}
          >
            Hello World. I am a developer.
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: '2.6rem',
              textAlign: 'center',
              maxWidth: '75%',
              whiteSpace: 'pre-line',
              lineHeight: 1.7,
              letterSpacing: '0.03em',
              color: '#0a0a0a', /* Fixed: Dark text to prevent fading */
              textShadow: '0 0 20px rgba(0,0,0,0.1)', /* Fixed: Subtle dark shadow instead of white */
            }}
          >
            <motion.span
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              {typewriterText}
            </motion.span>
          </motion.div>
        )}

        {phase === 4 && (
          <motion.div
            key="phase4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop") center/cover no-repeat', /* Real Galaxy Background */
              backgroundColor: '#050816', /* Fallback color */
              perspective: 2000,
            }}
          >
            {/* Cosmic Background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 200,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: 'absolute',
                width: '200vw',
                height: '200vw',
                background:
                  'conic-gradient(from 0deg, rgba(80,120,255,0.08), transparent, rgba(180,120,255,0.08), transparent)',
                borderRadius: '50%',
                filter: 'blur(120px)',
              }}
            />

            {/* Deep Galaxy Glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
              }}
              style={{
                position: 'absolute',
                width: '900px',
                height: '900px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(63,114,175,0.3), transparent 70%)',
                filter: 'blur(100px)',
              }}
            />

            {/* Stars / Particles */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
              }}
            >
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <Particles />
              </Canvas>
            </div>

            {/* Floating Planets */}
            <motion.div
              animate={{
                y: [-20, 20, -20],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: 'absolute',
                top: '15%',
                left: '10%',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 30% 30%, #7dd3fc, #1e3a8a)',
                boxShadow: '0 0 80px rgba(125,211,252,0.4)',
              }}
            />

            <motion.div
              animate={{
                y: [20, -20, 20],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: 'absolute',
                bottom: '12%',
                right: '8%',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 30% 30%, #c084fc, #4c1d95)',
                boxShadow: '0 0 100px rgba(192,132,252,0.4)',
              }}
            />

            {/* Main Content */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 5,
                textAlign: 'center',
              }}
            >
              {/* Universe Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: 'absolute',
                  width: '600px',
                  height: '600px',
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                }}
              />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: 'absolute',
                  width: '750px',
                  height: '750px',
                  borderRadius: '50%',
                  border: '1px dashed var(--color-border)',
                }}
              />

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 100, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1.8,
                  ease: [0.19, 1, 0.22, 1],
                }}
                style={{
                  fontFamily: '"Cinzel", "Didot", "Playfair Display", serif',
                  fontSize: '9vw',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                  background:
                    'linear-gradient(to bottom, #ffffff, #9ec5ff, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 50px rgba(147,197,253,0.5)',
                  lineHeight: 1,
                }}
              >
                Ronit Bhati
              </motion.h1>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: '#dbeafe',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5em',
                  fontWeight: 300,
                }}
              >
                <motion.span
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  ✦
                </motion.span>

                <span>Welcome To My Universe</span>

                <motion.span
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  ✦
                </motion.span>
              </motion.div>

              {/* Tiny Orbiting Dot */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: 'absolute',
                  width: '420px',
                  height: '420px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'var(--color-text-luxury)',
                    boxShadow: '0 0 20px var(--color-text-luxury)',
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Button */}
            <motion.button
              onClick={onComplete}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
              whileHover={{
                scale: 1.08,
                boxShadow: '0 0 80px rgba(147,197,253,0.6)',
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute',
                bottom: '10%',
                padding: '1.2rem 3.5rem',
                borderRadius: '999px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-glass-bg)',
                backdropFilter: 'blur(20px)',
                color: 'var(--color-text-luxury)',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                zIndex: 10,
              }}
            >
              Enter Universe ✦
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
