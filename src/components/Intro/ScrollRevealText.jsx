import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRevealText({ text, className = '', style = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const section = el.closest('section') || el;
    const words = el.querySelectorAll('.scroll-word');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=150%', // Require 150% viewport height worth of scrolling to fully reveal
        scrub: 0.5, // Subtle delay scrub for extra fluid feel
        pin: true,
      }
    });

    tl.to(words, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none'
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [text]);

  // Split text into words
  const words = text.split(' ');

  return (
    <p
      ref={containerRef}
      className={`scroll-reveal-text ${className}`}
      style={{
        lineHeight: 1.6,
        fontSize: '2.5rem',
        fontWeight: 400,
        color: 'var(--color-text-luxury)',
        maxWidth: '900px',
        textAlign: 'center',
        wordWrap: 'break-word',
        ...style
      }}
    >
      {words.map((word, idx) => (
        <span
          key={idx}
          className="scroll-word"
          style={{
            display: 'inline-block',
            marginRight: '0.35em',
            opacity: 0.12,
            transition: 'color 0.4s ease',
            willChange: 'opacity'
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
