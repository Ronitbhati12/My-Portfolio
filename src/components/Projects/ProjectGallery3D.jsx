import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AppleCard from '../Cards/AppleCard';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import bhatiJewelsImg from '../../assets/bhatijewels.png';
import dragImg from '../../assets/drag.png';
import vastrrImg from '../../assets/vastrr.png';
import musicdbImg from '../../assets/musicdb.jpeg';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'BhatiJewels',
    type: 'E-Commerce / React / Tailwind CSS',
    description: 'A full-featured jewellery e-commerce platform with elegant product browsing, cart functionality, and a premium UI designed to reflect the luxury of the brand.',
    image: bhatiJewelsImg,
    tags: ['React', 'Tailwind CSS', 'JavaScript', 'Responsive UI'],
    link: '#',
    github: 'https://github.com/Ronitbhati12/bhati_jwels'
  },
  {
    id: 2,
    title: 'Drag Clothing',
    type: 'UI Interaction / React / Drag & Drop',
    description: 'An interactive clothing UI where users drag and arrange fashion items in real time. Smooth drag mechanics with a clean, modern storefront aesthetic.',
    image: dragImg,
    tags: ['React', 'Drag & Drop', 'CSS Animations', 'JavaScript'],
    link: '#',
    github: 'https://github.com/Ronitbhati12/Drag_Clothing'
  },
  {
    id: 3,
    title: 'Vastrrr',
    type: 'Fashion Platform / React / Tailwind CSS',
    description: 'A dynamic fashion discovery platform with category filtering, responsive product grids, and a sleek dark-mode interface built for the modern shopper.',
    image: vastrrImg,
    tags: ['React', 'Tailwind CSS', 'REST API', 'Responsive Design'],
    link: '#',
    github: 'https://github.com/Ronitbhati12/Vastrr'
  },
  {
    id: 4,
    title: 'MusicDB',
    type: 'Music Platform / SQL / CSS',
    description: 'Developed a music rating and review web platform inspired by IMDb. Designed responsive and modern UI with CSS animations and implemented search and database-driven content using SQL.',
    image: musicdbImg,
    tags: ['SQL', 'CSS Animations', 'Database', 'UI Design'],
    link: '#',
    github: 'https://github.com/Ronitbhati12/MusicDB'
  }
];

export default function ProjectGallery3D() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    
    if (!container || !track) return;

    // Calculate total horizontal travel distance
    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const windowWidth = window.innerWidth;
      return -(trackWidth - windowWidth);
    };

    const scrollTween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        scrub: 1, // Inertia scrub for buttery smooth movement
        invalidateOnRefresh: true, // Recalculate on screen resize
      }
    });

    return () => {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100vw', overflow: 'hidden' }}>
      {/* Sticky Inner Container */}
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
        overflow: 'hidden'
      }}>
        {/* Horizontal Moving Track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '3.5rem',
            padding: '0 10vw',
            willChange: 'transform',
            alignItems: 'center',
            height: '80%'
          }}
        >
          {/* Introductory Card */}
          <div style={{
            width: '350px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '450px'
          }}>
            
            <h2 className="text-gradient-luxury" style={{
              fontSize: '3rem',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              textTransform: 'uppercase'
            }}>
              Selected<br />Digital Worlds
            </h2>
            <p style={{
              color: 'var(--color-accent-light)',
              opacity: 0.7,
              fontSize: '1rem',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              A collection of interfaces, experiments, and immersive systems crafted to push the boundaries between frontend engineering and visual storytelling.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <span>Drag reality sideways</span>
              <span style={{ fontSize: '1.2rem', animation: 'bounce-horizontal 1.5s infinite' }}>→</span>
            </div>
          </div>

          {/* Project Cards */}
          {projects.map((project) => (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              key={project.id}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
            <AppleCard
              style={{
                width: '450px',
                height: '520px',
                flexShrink: 0,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                {/* Image Container with depth-effect overlay */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 60%, rgba(5,11,20,0.8))',
                    zIndex: 1
                  }} />
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s var(--ease-apple)'
                    }}
                    className="project-card-image"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 2,
                    background: 'rgba(5, 11, 20, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--color-border)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}>
                    <ArrowUpRight size={18} color="var(--color-text-luxury)" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-accent-base)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.4rem'
                  }}>
                    {project.type}
                  </span>
                  <h3 style={{
                    fontSize: '1.8rem',
                    color: 'var(--color-text-luxury)',
                    marginBottom: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em'
                  }}>
                    {project.title}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-accent-light)',
                    opacity: 0.8,
                    lineHeight: 1.5,
                    fontWeight: 300,
                    marginBottom: '1.5rem',
                    height: '65px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {project.description}
                  </p>
                </div>

                {/* Footer / Tags */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '1.2rem',
                  marginTop: 'auto'
                }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.7rem',
                        background: 'var(--color-tag-bg)',
                        color: 'var(--color-tag-text)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-tag-border)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="var(--color-text-muted)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    <ExternalLink size={16} color="var(--color-text-muted)" />
                  </div>
                </div>
              </div>
            </AppleCard>
            </a>
          ))}

          {/* Outro/End Card */}
          <div style={{
            width: '300px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '450px',
            paddingLeft: '2rem'
          }}>
            <h3 className="text-gradient-gold" style={{
              fontSize: '2rem',
              lineHeight: 1.2,
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              Want to see<br />more?
            </h3>
            <p style={{
              color: 'var(--color-accent-light)',
              opacity: 0.6,
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              I am constantly building new projects and pushing my frontend skills further. Let's create something together.
            </p>
            <a href="https://github.com/repos?q=owner%3A%40me" target="_blank" rel="noopener noreferrer" className="glass-btn interactive" style={{
              padding: '0.8rem 1.8rem',
              borderRadius: '30px',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              width: 'fit-content',
              textDecoration: 'none',
              color: 'inherit'
            }}>
              View GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
