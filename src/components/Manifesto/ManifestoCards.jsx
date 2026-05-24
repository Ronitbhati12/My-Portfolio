import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Crosshair, Code2, Brain, Hammer, Paintbrush, Flame } from 'lucide-react';

// ── Keep your local imports ──────────────────────────────────────────────────
import ronitImg    from '../../assets/ronit.jpg';
import whoAmIImg   from '../../assets/2.png';
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

// Each card occupies 2 timeline units: 1 for transition-in, 1 for hold.
// Last card gets an extra hold. Total = (N-1)*2 + 2 = N*2
const UNIT        = 1;
const TOTAL       = manifesto.length;
const TL_DURATION = TOTAL * 2 * UNIT; // used only as reference for progress math

export default function ManifestoCards() {
  const [active, setActive]   = useState(0);
  const sectionRef            = useRef(null);
  const cardRefs              = useRef([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // ── Initial states ────────────────────────────────────────────────────────
    // All cards: hidden, translated down. No scale — avoids GPU jank with scrub.
    gsap.set(cardRefs.current, { opacity: 0, y: 50, pointerEvents: 'none' });
    gsap.set(cardRefs.current[0], { opacity: 1, y: 0, pointerEvents: 'auto' });

    // ── Timeline ──────────────────────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:   el,
        start:     'top top',
        end:       `+=${TOTAL * 110}vh`,
        pin:       true,
        pinSpacing: true,
        scrub:     1,                       // 1 s smoothing — buttery not laggy
        onUpdate(self) {
          // Map progress → active index.
          // Each card "owns" 1/(TOTAL) of the timeline.
          // Clamp to avoid overshooting last card.
          const idx = Math.min(
            Math.floor(self.progress * TOTAL),
            TOTAL - 1
          );
          setActive(idx);
        },
      },
    });

    // ── Build sequence ────────────────────────────────────────────────────────
    // Card i lives at timeline position [i*2, i*2+2].
    // Crossfade: card i fades out over [i*2, i*2+1],
    //            card i+1 fades in over [i*2+0.4, i*2+1.4] (0.4 overlap).
    for (let i = 0; i < TOTAL - 1; i++) {
      const pos = i * 2 * UNIT;

      // Fade OUT current card (translate up slightly — no scale)
      tl.to(cardRefs.current[i], {
        opacity:       0,
        y:            -40,
        pointerEvents: 'none',
        duration:      UNIT,
        ease:          'power2.inOut',
      }, pos);

      // Fade IN next card (translate from below — no scale)
      tl.fromTo(
        cardRefs.current[i + 1],
        { opacity: 0, y: 50, pointerEvents: 'none' },
        {
          opacity:       1,
          y:             0,
          pointerEvents: 'auto',
          duration:      UNIT,
          ease:          'power2.inOut',
        },
        pos + UNIT * 0.4   // 40% overlap → smooth crossfade without flicker
      );
    }

    // Hold last card
    tl.to({}, { duration: UNIT * 2 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const activeColor = manifesto[active]?.color ?? '#ffffff';

  return (
    <div
      ref={sectionRef}
      style={{
        position:        'relative',
        width:           '100%',
        height:          '100vh',
        backgroundColor: '#050507',
        overflow:        'hidden',
        fontFamily:      "'Inter', sans-serif",
      }}
    >
      {/* ── Dynamic Glow Orb ────────────────────────────────────────────────── */}
      <div
        style={{
          position:   'absolute',
          top:        '50%',
          left:       '50%',
          width:      '60vw',
          height:     '60vw',
          transform:  'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${activeColor}22 0%, transparent 60%)`,
          filter:     'blur(100px)',
          transition: 'background 0.8s ease',
          pointerEvents: 'none',
          zIndex:     0,
        }}
      />

      {/* ── Noise Overlay ───────────────────────────────────────────────────── */}
      <div
        style={{
          position:        'absolute',
          inset:           0,
          opacity:         0.03,
          pointerEvents:   'none',
          zIndex:          1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Cards ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          position:        'absolute',
          inset:           0,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          zIndex:          2,
        }}
      >
        {manifesto.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{
                position:   'absolute',
                width:      'min(1100px, 90vw)',
                height:     'min(650px, 80vh)',
                display:    'flex',
                gap:        'clamp(2rem, 4vw, 4rem)',
                alignItems: 'center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Glass text panel */}
              <div
                style={{
                  flex:                '1',
                  padding:             '3.5rem',
                  background:          'rgba(20, 20, 25, 0.4)',
                  backdropFilter:      'blur(30px)',
                  WebkitBackdropFilter:'blur(30px)',
                  borderTop:          `1px solid ${m.color}30`,
                  borderLeft:         `1px solid ${m.color}15`,
                  borderBottom:        '1px solid rgba(255,255,255,0.02)',
                  borderRight:         '1px solid rgba(255,255,255,0.02)',
                  borderRadius:        '24px',
                  boxShadow:          `0 30px 60px -10px rgba(0,0,0,0.8), inset 0 0 40px ${m.color}05`,
                }}
              >
                {/* Accent line */}
                <div
                  style={{
                    height:     '2px',
                    width:      '40px',
                    background: m.color,
                    marginBottom: '2rem',
                    boxShadow:  `0 0 15px ${m.color}`,
                  }}
                />

                {/* Label row */}
                <div
                  style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          '12px',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Icon size={20} color={m.color} strokeWidth={1.5} />
                  <span
                    style={{
                      fontSize:      '0.85rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color:         m.color,
                      fontWeight:    600,
                    }}
                  >
                    {m.label}
                  </span>
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontSize:      'clamp(2.5rem, 4vw, 4.5rem)',
                    fontWeight:    700,
                    color:         '#ffffff',
                    letterSpacing: '-0.02em',
                    lineHeight:    1.1,
                    marginBottom:  '2rem',
                  }}
                >
                  {m.title}
                </h2>

                {/* Body */}
                <p
                  style={{
                    fontSize:   'clamp(1.05rem, 1.2vw, 1.25rem)',
                    color:      'rgba(255, 255, 255, 0.65)',
                    lineHeight: 1.8,
                    fontWeight: 300,
                    margin:     0,
                  }}
                >
                  {m.body}
                </p>
              </div>

              {/* Image panel */}
              <div
                style={{
                  flex:         '1',
                  height:       '85%',
                  borderRadius: '24px',
                  overflow:     'hidden',
                  position:     'relative',
                  boxShadow:    '0 20px 50px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  style={{
                    position:     'absolute',
                    inset:        0,
                    background:  `linear-gradient(to top right, ${m.color}30 0%, transparent 100%)`,
                    mixBlendMode: 'overlay',
                    zIndex:       1,
                  }}
                />
                <img
                  src={m.image}
                  alt={m.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Progress dots ────────────────────────────────────────────────────── */}
      <div
        style={{
          position:  'absolute',
          bottom:    '40px',
          left:      '50%',
          transform: 'translateX(-50%)',
          display:   'flex',
          gap:       '12px',
          zIndex:    10,
        }}
      >
        {manifesto.map((m, i) => (
          <div
            key={i}
            style={{
              width:      active === i ? '32px' : '8px',
              height:     '4px',
              borderRadius: '4px',
              background: active === i ? m.color : 'rgba(255,255,255,0.15)',
              boxShadow:  active === i ? `0 0 10px ${m.color}80` : 'none',
              transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}