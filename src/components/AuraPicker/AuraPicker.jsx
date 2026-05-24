import React from 'react';
import { useTheme } from '../../useTheme';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

const auras = [
  { id: 'blue', color: '#3b82f6', label: 'Deep Ocean' },
  { id: 'emerald', color: '#10b981', label: 'Matrix' },
  { id: 'crimson', color: '#f43f5e', label: 'Cyberpunk' },
  { id: 'violet', color: '#8b5cf6', label: 'Royal' },
];

export default function AuraPicker() {
  const { aura, setAura } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: '6rem', // Positioned below the theme toggle
        right: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 50,
        background: 'var(--color-glass-bg)',
        backdropFilter: 'blur(12px)',
        padding: '0.75rem',
        borderRadius: '30px',
        border: '1px solid var(--color-glass-border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        alignItems: 'center',
      }}
    >
      <Palette size={16} color="var(--color-text-secondary)" style={{ marginBottom: '0.25rem' }} />
      {auras.map((a) => (
        <button
          key={a.id}
          onClick={() => setAura(a.id)}
          title={a.label}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: a.color,
            border: aura === a.id ? '2px solid white' : '2px solid transparent',
            outline: aura === a.id ? `2px solid ${a.color}` : 'none',
            outlineOffset: '2px',
            cursor: 'none',
            transition: 'all 0.3s ease',
            boxShadow: aura === a.id ? `0 0 15px ${a.color}80` : 'none',
            transform: aura === a.id ? 'scale(1.1)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.2)';
            e.currentTarget.style.boxShadow = `0 0 10px ${a.color}80`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = aura === a.id ? 'scale(1.1)' : 'scale(1)';
            e.currentTarget.style.boxShadow = aura === a.id ? `0 0 15px ${a.color}80` : 'none';
          }}
        />
      ))}
    </motion.div>
  );
}
