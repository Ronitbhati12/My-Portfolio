import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Compass, Cpu, Layers, Activity, Zap, Globe } from 'lucide-react';

const skills = [
  {
    title: "React Engineering",
    desc: "Building reusable, scalable UI components with React.js. From dynamic state management to API integration — clean code that performs in production.",
    tag: "Component architecture",
    color: "#3b82f6", // Blue
    icon: <Compass size={24} color="#3b82f6" />,
    doodle: "/doodles/react.png"
  },
  {
    title: "Pixel-Perfect UI",
    desc: "Crafting responsive, mobile-first interfaces with Tailwind CSS. Every layout adapts flawlessly across screen sizes without sacrificing visual quality.",
    tag: "Responsive design",
    color: "#fbbf24", // Gold
    icon: <Cpu size={24} color="#fbbf24" />,
    doodle: "/doodles/responsive.png"
  },
  {
    title: "Clean Workflow",
    desc: "Version control with Git and GitHub, collaborative branching, code reviews, and structured development cycles — shipping features the right way.",
    tag: "Git & GitHub",
    color: "#a855f7", // Purple
    icon: <Layers size={24} color="#a855f7" />,
    doodle: "/doodles/git.png"
  },
  {
    title: "Builder Mindset",
    desc: "From airline systems in Java to gesture recognition in Python — I pick up new tools fast and build end-to-end solutions that solve real problems.",
    tag: "C / C++ / Python",
    color: "#ec4899", // Pink
    icon: <Activity size={24} color="#ec4899" />,
    doodle: "/doodles/programming.png"
  },
  {
    title: "Motion & Animation",
    desc: "Crafting buttery-smooth animations with Framer Motion, GSAP & CSS. Spring physics, scroll-driven effects, and micro-interactions that breathe life into every pixel.",
    tag: "Framer Motion / GSAP",
    color: "#06b6d4", // Cyan
    icon: <Zap size={24} color="#06b6d4" />,
    doodle: "/doodles/motion.png"
  },
  {
    title: "API Integration",
    desc: "Connecting frontends to the world — RESTful APIs, real-time data fetching, authentication flows, and seamless backend communication for dynamic experiences.",
    tag: "REST / Fetch / Axios",
    color: "#10b981", // Emerald
    icon: <Globe size={24} color="#10b981" />,
    doodle: "/doodles/api.png"
  }
];

function IllusionCard({ skill, index }) {
  const cardRef = useRef(null);
  
  // Mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for mouse
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Aggressive rotations for deep 3D effect
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Generate 7 mirror layers for an infinite void illusion
  const mirrorLayers = Array.from({ length: 7 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.19, 1, 0.22, 1] }}
      style={{
        position: 'relative',
        height: '420px',
        width: '100%',
        perspective: '1500px', // Deep perspective
        cursor: 'crosshair',
        zIndex: 10
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
      >
        {/* Infinite Mirror Tunnels */}
        {mirrorLayers.map((_, i) => {
          const depth = i * -80; // pushes each layer further back into the screen
          const scale = 1 - (i * 0.04); // shrinks slightly to create tunnel perspective
          const opacity = 1 - (i * 0.15); // fades out into the abyss
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: `1px solid ${skill.color}`,
                borderRadius: '24px',
                transform: `translateZ(${depth}px) scale(${scale})`,
                opacity: opacity,
                boxShadow: i === 0 ? `0 0 30px ${skill.color}20, inset 0 0 20px ${skill.color}10` : `inset 0 0 15px ${skill.color}20`,
                pointerEvents: 'none',
                background: i === mirrorLayers.length - 1 ? 'var(--color-bg-deep)' : 'var(--color-input-bg)', // The deepest layer is the theme bg
                backdropFilter: i === 0 ? 'blur(4px)' : 'none',
                overflow: 'hidden'
              }}
            >
              {/* Doodle image in the deepest 3 layers */}
              {i >= mirrorLayers.length - 3 && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${skill.doodle})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: i === mirrorLayers.length - 1 ? 0.35 : 0.15,
                  mixBlendMode: 'lighten',
                  filter: `blur(${(mirrorLayers.length - 1 - i) * 2}px)`,
                }} />
              )}
            </div>
          );
        })}

        {/* Doodle Image - Visible behind content with gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          overflow: 'hidden',
          transform: 'translateZ(-30px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          <img 
            src={skill.doodle} 
            alt={skill.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.12,
              mixBlendMode: 'lighten',
              filter: 'blur(1px) saturate(1.5)',
            }}
          />
          {/* Gradient overlay from bottom so text stays readable */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, var(--color-bg-deep) 10%, transparent 80%)`,
          }} />
        </div>

        {/* Floating Background Glow */}
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translateZ(-200px)',
            width: '70%',
            height: '70%',
            background: skill.color,
            filter: 'blur(100px)',
            opacity: 0.15,
            pointerEvents: 'none',
            borderRadius: '50%'
        }} />

        {/* Top Content Layer - Floats out towards the user */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            transform: 'translateZ(80px)', // Floats ABOVE the screen
            transformStyle: 'preserve-3d',
            pointerEvents: 'none'
          }}
        >
          {/* Floating Icon */}
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: `${skill.color}15`,
            border: `1px solid ${skill.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'auto',
            transform: 'translateZ(40px)', // Pushed even further
            boxShadow: `0 0 20px ${skill.color}30`
          }}>
            {skill.icon}
          </div>

          <motion.div
            style={{
              transform: 'translateZ(60px)', // Text floats highest
            }}
          >
            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text-luxury)', marginBottom: '1rem', fontWeight: 600, textShadow: `0 0 20px ${skill.color}60` }}>
              {skill.title}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', fontWeight: 300 }}>
              {skill.desc}
            </p>
            
            {/* Tag block */}
            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.4rem 1rem', background: `${skill.color}10`, border: `1px solid ${skill.color}30`, borderRadius: '50px', color: skill.color, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span>{skill.tag}</span>
            </div>
          </motion.div>
        </motion.div>
        
      </motion.div>
    </motion.div>
  );
}

export default function IllusionSkills() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '3rem',
      width: '100%',
      paddingTop: '2rem'
    }}>
      {skills.map((skill, index) => (
        <IllusionCard key={index} skill={skill} index={index} />
      ))}
    </div>
  );
}
