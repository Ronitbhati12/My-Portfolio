import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Crosshair, Code2, Brain, Hammer, Paintbrush, Flame } from 'lucide-react';
import ronitImg from '../../assets/ronit.jpg';
import whoAmIImg from '../../assets/2.png';
import whatIKnowImg from '../../assets/download (3).jfif';

gsap.registerPlugin(ScrollTrigger);

const manifesto = [
  {
    label: 'Origin',
    title: 'I Am Ronit',
    body: "I'm not just a developer. I'm an architect of digital feelings — someone who believes that the web should move, breathe, and make you feel something the moment you land on it. Every pixel I place has intention.",
    color: '#3b82f6',
    icon: User,
    image: ronitImg,
  },
  {
    label: 'Identity',
    title: 'Who I Am',
    body: "A 20-year-old frontend obsessive from Jaipur who chose code over comfort. I don't follow trends — I study motion, typography, and emotion until I can weaponize them into interfaces that feel impossible.",
    color: '#8b5cf6',
    icon: Crosshair,
    image: whoAmIImg,
  },
  {
    label: 'Craft',
    title: 'What I Do',
    body: "I engineer immersive web experiences — scroll-driven narratives, physics-based animations, cinematic transitions, and reactive UI systems that blur the line between a website and a piece of art.",
    color: '#06b6d4',
    icon: Code2,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    label: 'Arsenal',
    title: 'What I Know',
    body: "React · Tailwind · Framer Motion · GSAP · Three.js · JavaScript · Python · C/C++ · Git — and the rare ability to make all of them dance together in harmony.",
    color: '#f59e0b',
    icon: Brain,
    image: whatIKnowImg,
  },
  {
    label: 'Portfolio',
    title: 'What I Make',
    body: "Premium e-commerce platforms, interactive fashion UIs, gesture-recognition systems, and personal brand websites that look like they cost a fortune — but were built with pure obsession.",
    color: '#ec4899',
    icon: Hammer,
    image: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1000&auto=format&fit=crop',
  },
  {
    label: 'Aesthetic',
    title: 'My Style',
    body: "Dark luxury. Glassmorphism. Cinematic motion. I design interfaces that feel like walking into a sci-fi film — where every glow, shadow, and transition is intentionally placed to create atmosphere.",
    color: '#10b981',
    icon: Paintbrush,
    image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000&auto=format&fit=crop',
  },
  {
    label: 'Manifesto',
    title: 'My Philosophy',
    body: "Good enough is the enemy of unforgettable. I don't ship until the easing curve feels right, the blur intensity is perfect, and the scroll feels like silk. The last 10% is where legends are made.",
    color: '#f43f5e',
    icon: Flame,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function ManifestoCards() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !cardRefs.current.length) return;

    const TOTAL = manifesto.length;

    // Create a master GSAP timeline tied to the scroll position
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: `+=${TOTAL * 120}vh`, // Pinned duration: 120vh per card provides a great balance of reading time and smooth scrolling
        pin: true,
        pinSpacing: true,
        scrub: 1.5, // 1.5 seconds of smoothing for buttery floaty effect
        onUpdate: (self) => {
          // Total timeline duration calculation
          const totalDuration = (TOTAL - 1) * 2 + 1.5;
          const currentTime = self.progress * totalDuration;
          
          // Each card transition happens at multiples of 2.
          // By adding 0.5, the active index switches exactly when the crossfade begins.
          const idx = Math.min(Math.floor((currentTime + 0.5) / 2), TOTAL - 1);
          setActive(idx);
        }
      }
    });

    // Build the crossfade animation sequence with PAUSES for reading
    cardRefs.current.forEach((card, i) => {
      // Set initial states
      if (i === 0) {
        gsap.set(card, { opacity: 1, y: 0 });
      } else {
        gsap.set(card, { opacity: 0, y: 40 });
      }

      const startTime = i * 2;
      
      // If not the first card, it needs to fade in
      if (i > 0) {
        tl.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, startTime - 0.5);
      }

      // If not the last card, it needs to fade out AFTER a 1.5s pause
      if (i < TOTAL - 1) {
        tl.to(card, { opacity: 0, y: -40, duration: 0.5, ease: 'power2.in' }, startTime + 1.5);
      }
    });

    // Add a pause at the very end so the last card lingers before unpinning
    tl.to({}, { duration: 1.5 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const item = manifesto[active] || manifesto[0];

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: 'var(--color-bg-deep)',
        overflow: 'hidden',
        userSelect: 'none',
        borderTop: '1px solid var(--color-border)',
        transition: 'background-color 0.8s ease',
      }}
    >
      {/* Subtle color wash behind active card */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${item.color}12 0%, transparent 70%)`,
        transition: 'background 0.8s ease',
        pointerEvents: 'none',
      }} />

      {/* Cards Container */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {manifesto.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: i === active ? 'auto' : 'none', // Only active card is clickable
                willChange: 'opacity, transform',
              }}
            >
              <div style={{ 
                width: 'min(1100px, 92vw)',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(3rem, 6vw, 8rem)',
                justifyContent: 'space-between',
              }}>
                {/* Photo Left */}
                <div style={{
                  flex: '0 0 42%',
                  aspectRatio: '3/4',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${m.color}30`,
                  boxShadow: `0 20px 60px ${m.color}15`,
                  position: 'relative'
                }}>
                  {/* Robust image rendering */}
                  <img 
                    src={m.image} 
                    alt={m.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 0
                    }}
                  />
                  {/* Subtle gradient overlay to match accent color */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to top, ${m.color}50, transparent)`,
                    mixBlendMode: 'overlay'
                  }} />
                  {/* Inner glow */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    boxShadow: `inset 0 0 100px ${m.color}20`,
                    pointerEvents: 'none'
                  }} />
                </div>

                {/* Content Right */}
                <div style={{ flex: '1', minWidth: '0' }}>
                  {/* Color accent line */}
                  <div style={{
                    height: '4px',
                    width: '60px',
                    background: m.color,
                    marginBottom: '3rem',
                    borderRadius: '2px',
                  }} />

                  {/* Label + number */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '1.5rem',
                  }}>
                    <span style={{
                      fontSize: '0.8rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: m.color,
                      fontFamily: 'var(--font-mono, monospace)',
                    }}>{m.label}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-mono, monospace)',
                      letterSpacing: '0.15em',
                    }}>{String(i + 1).padStart(2,'0')} / {String(manifesto.length).padStart(2,'0')}</span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontSize: 'clamp(3rem, 5.5vw, 5rem)',
                    fontWeight: 700,
                    color: 'var(--color-text-luxury)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    marginBottom: '2rem',
                    fontFamily: "'Georgia', var(--font-heading, serif)",
                  }}>{m.title}</h2>

                  {/* Body */}
                  <p style={{
                    fontSize: 'clamp(1.1rem, 1.3vw, 1.4rem)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                    fontWeight: 400,
                    margin: 0,
                    maxWidth: '100%',
                  }}>{m.body}</p>

                  {/* Icon chip */}
                  <div style={{
                    marginTop: '3rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 18px',
                    border: `1px solid ${m.color}30`,
                    background: `${m.color}08`,
                    borderRadius: '8px',
                  }}>
                    <Icon size={18} color={m.color} />
                    <span style={{
                      fontSize: '0.8rem',
                      color: m.color,
                      fontFamily: 'var(--font-mono, monospace)',
                      letterSpacing: '0.15em',
                      fontWeight: 500,
                    }}>{m.label.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Left: vertical dots */}
      <div style={{
        position: 'absolute',
        left: '3vw',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10,
      }}>
        {manifesto.map((m, i) => (
          <div
            key={i}
            style={{
              width: active === i ? '20px' : '6px',
              height: '3px',
              borderRadius: '2px',
              background: active >= i ? m.color : 'var(--color-border)',
              transition: 'all 0.4s cubic-bezier(0.25,1,0.5,1)',
            }}
          />
        ))}
      </div>

      {/* Right: vertical label */}
      <div style={{
        position: 'absolute',
        right: '3vw',
        top: '50%',
        transform: 'translateY(-50%)',
        writingMode: 'vertical-rl',
        fontSize: '0.65rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: item.color,
        fontFamily: 'var(--font-mono, monospace)',
        transition: 'color 0.5s ease',
        opacity: 0.7,
        zIndex: 10,
      }}>
        {item.label}
      </div>

      {/* Bottom: scroll hint */}
      <div style={{
        position: 'absolute',
        bottom: '3vh',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <span style={{
          fontSize: '0.65rem',
          fontFamily: 'var(--font-mono, monospace)',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>Keep Scrolling ↓</span>
      </div>
    </div>
  );
}
