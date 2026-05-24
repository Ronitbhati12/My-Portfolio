import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Cursor from './components/Cursor/Cursor';
import LivingBackground from './components/Background/LivingBackground';
import StoryIntro from './components/Intro/StoryIntro';
import SmoothScroll from './components/SmoothScroll/SmoothScroll';
import Preloader from './components/Preloader/Preloader';
import ProjectGallery3D from './components/Projects/ProjectGallery3D';
import ScrollRevealText from './components/Intro/ScrollRevealText';
import AppleCard from './components/Cards/AppleCard';
import IllusionSkills from './components/Skills/IllusionSkills';
import ManifestoCards from './components/Manifesto/ManifestoCards';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from './useTheme';
import AuraPicker from './components/AuraPicker/AuraPicker';
import { Sparkles, Send, ArrowDown, Mail, MapPin, Sun, Moon } from 'lucide-react';

// ====== THEME TOGGLE BUTTON COMPONENT ======
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.button
      onClick={toggleTheme}
      className="interactive"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 9000,
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: `1px solid ${isLight ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.1)'}`,
        background: isLight ? 'rgba(255,255,255,0.75)' : 'rgba(14,26,47,0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isLight
          ? '0 4px 24px rgba(37,99,235,0.15)'
          : '0 4px 24px rgba(0,0,0,0.3)',
        transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
      }}
    >
      <AnimatePresence mode="wait">
        {isLight ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun size={22} color="#d97706" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon size={20} color="#93c5fd" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function MainSite() {
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  // Custom scroll tracking for simple parallaxes
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const text = `${message}`;
    const whatsappUrl = `https://wa.me/917425010784?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 5000);
  };

  return (
    <SmoothScroll>
      <div className="story-scroll-progress" style={{ transformScaleX: scrollYProgress }} />
      
      <main ref={containerRef} style={{ position: 'relative', zIndex: 10, overflow: 'hidden', transition: 'color 0.6s ease' }}>
        
        {/* ================= CHAPTER ONE: HERO ================= */}
        <section className="mobile-section-padding" style={{ height: '100vh', padding: '0 8vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
           
            <motion.h1 
              className="text-gradient-luxury" 
              style={{ fontSize: '6vw', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.95, transition: 'color 0.6s ease' }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              I Don't Build Websites.<br />I Build Digital Atmospheres.
            </motion.h1>
            <motion.p 
              style={{ fontSize: '1.25rem', maxWidth: '650px', lineHeight: 1.7, marginTop: '2.5rem', color: 'var(--color-accent-light)', fontWeight: 300, opacity: 0.85 }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Most websites are forgotten within seconds. I obsess over the opposite. Every interaction, motion, glow, transition, and scroll is engineered to make people feel something. I blend frontend engineering with cinematic storytelling to craft experiences that look impossible — yet feel effortless. Welcome to the universe of Ronit Bhati.
            </motion.p>
            
           
          </motion.div>

          {/* Scroll Down Indicator */}
          <div style={{ position: 'absolute', bottom: '6%', left: '8vw', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            <span style={{ display: 'flex', flexDirection: 'column', animation: 'bounce-vertical 2s infinite' }}>
              <ArrowDown size={14} />
            </span>
            <span>Scroll to descend deeper</span>
          </div>
        </section>


        {/* ================= CHAPTER TWO: THE PHILOSOPHY ================= */}
        <section className="mobile-section-padding" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 8vw', position: 'relative', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ position: 'absolute', top: '10%', left: '8vw' }}>
        
          </div>
          
          <ScrollRevealText 
            text="I see interfaces differently. To me, frontend is not boxes, buttons, and layouts — it is emotion engineered through pixels. A perfect animation can feel alive. A smooth transition can create trust. A single interaction can become a memory. I build for that feeling. The moment where technology disappears… and experience begins."
          />
        </section>


        {/* ================= CHAPTER: THE MANIFESTO ================= */}
        <ManifestoCards />


        {/* ================= CHAPTER THREE: THE CRAFT (BENTO GRID) ================= */}
        <section className="mobile-section-padding" style={{ minHeight: '120vh', padding: '15vh 8vw', position: 'relative', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ marginBottom: '5rem' }}>
            <h2 className="text-gradient-luxury" style={{ fontSize: '3.5vw', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Designing systems that feel alive.
            </h2>
          </div>
          <IllusionSkills />
        </section>


        {/* ================= CHAPTER FOUR: SELECTED WORKS ================= */}
        <section style={{ minHeight: '100vh', position: 'relative', borderTop: '1px solid var(--color-border)' }}>
          <ProjectGallery3D />
        </section>


        {/* ================= CHAPTER FIVE: THE CREATIVE PROCESS ================= */}
        <section className="mobile-section-padding" style={{ minHeight: '120vh', padding: '15vh 8vw', position: 'relative', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '6rem' }}>
             
              <h2 className={isLight ? "" : "text-gradient-luxury"} style={{ fontSize: '4.5vw', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, color: isLight ? '#0f172a' : undefined }}>
                How Experiences Are Crafted
              </h2>
            </div>

            {/* Split timeline content */}
            <div className="timeline-container" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6rem',
              maxWidth: '900px',
              alignSelf: 'center',
              width: '100%',
              position: 'relative'
            }}>
              {/* Vertical line connector */}
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '20px',
                bottom: '20px',
                width: '1px',
                background: 'linear-gradient(to bottom, var(--color-accent-base), var(--color-gold), transparent)',
                opacity: 0.4
              }} />

              {/* Step 1 */}
              <div style={{ display: 'flex', gap: '2.5rem', position: 'relative' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-accent-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-accent-base)',
                  zIndex: 2,
                  boxShadow: '0 0 20px rgba(59,130,246,0.3)'
                }}>
                  01
                </div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text-luxury)', marginBottom: '0.8rem', fontWeight: 600 }}>Vision Extraction</h3>
                  <p style={{ color: isLight ? '#0f172a' : 'var(--color-accent-light)', opacity: isLight ? 0.95 : 0.75, lineHeight: 1.7, fontWeight: isLight ? 500 : 300, fontFamily: isLight ? 'var(--font-heading)' : 'var(--font-body)', letterSpacing: isLight ? '0.02em' : 'normal' }}>
                    Before code comes emotion. I decode the atmosphere a product should create — futuristic, luxurious, cinematic, minimal, chaotic, elegant. Every project begins with feeling.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', gap: '2.5rem', position: 'relative' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-gold)',
                  zIndex: 2,
                  boxShadow: '0 0 20px rgba(251,191,36,0.3)'
                }}>
                  02
                </div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text-luxury)', marginBottom: '0.8rem', fontWeight: 600 }}>Interface Architecture</h3>
                  <p style={{ color: isLight ? '#0f172a' : 'var(--color-accent-light)', opacity: isLight ? 0.95 : 0.75, lineHeight: 1.7, fontWeight: isLight ? 500 : 300, fontFamily: isLight ? 'var(--font-heading)' : 'var(--font-body)', letterSpacing: isLight ? '0.02em' : 'normal' }}>
                    I design systems that balance beauty with structure. Typography rhythms, grid mathematics, motion layers, spacing harmony — every detail is intentional.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', gap: '2.5rem', position: 'relative' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-step-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-step-3)',
                  zIndex: 2,
                  boxShadow: '0 0 20px var(--color-step-3-glow)'
                }}>
                  03
                </div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text-luxury)', marginBottom: '0.8rem', fontWeight: 600 }}>Motion Engineering</h3>
                  <p style={{ color: isLight ? '#0f172a' : 'var(--color-accent-light)', opacity: isLight ? 0.95 : 0.75, lineHeight: 1.7, fontWeight: isLight ? 500 : 300, fontFamily: isLight ? 'var(--font-heading)' : 'var(--font-body)', letterSpacing: isLight ? '0.02em' : 'normal' }}>
                    This is where static designs become alive. Smooth scroll systems, reactive animations, physics-based interactions, cinematic transitions — engineered frame by frame.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div style={{ display: 'flex', gap: '2.5rem', position: 'relative' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-step-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-step-4)',
                  zIndex: 2,
                  boxShadow: '0 0 20px var(--color-step-4-glow)'
                }}>
                  04
                </div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text-luxury)', marginBottom: '0.8rem', fontWeight: 600 }}>Final Polish</h3>
                  <p style={{ color: isLight ? '#0f172a' : 'var(--color-accent-light)', opacity: isLight ? 0.95 : 0.75, lineHeight: 1.7, fontWeight: isLight ? 500 : 300, fontFamily: isLight ? 'var(--font-heading)' : 'var(--font-body)', letterSpacing: isLight ? '0.02em' : 'normal' }}>
                    The last 10% is what separates ordinary from unforgettable. Micro-delays, easing curves, blur intensity, glow behavior, responsiveness, performance tuning — perfection lives here.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ================= CHAPTER SIX: CONTACT ================= */}
        <section className="mobile-section-padding" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10vh 8vw', position: 'relative', borderTop: '1px solid var(--color-border)' }}>
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center', width: '100%' }}>
            
            {/* Text details */}
            <div>
             
              <h2 className="text-gradient-luxury" style={{ fontSize: '4.5vw', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '2rem' }}>
                Let's Build<br />Something Impossible
              </h2>
              <p style={{ color: 'var(--color-accent-light)', opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.7, fontWeight: 300, marginBottom: '3rem', maxWidth: '450px' }}>
                If you are looking for another generic developer, this is not the right place. But if you want an experience that feels futuristic, immersive, and unforgettable — let's create it together.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-accent-light)' }}>
                  <Mail size={18} color="var(--color-accent-base)" />
                  <span style={{ fontWeight: 300 }}>bhatironit03@gmail.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-accent-light)' }}>
                  <MapPin size={18} color="var(--color-accent-base)" />
                  <span style={{ fontWeight: 300 }}>Jaipur, Rajasthan</span>
                </div>
              </div>
            </div>

            {/* Glassmorphic Contact Card */}
            <AppleCard style={{ height: 'auto', padding: '0.5rem' }} tilt={false}>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text-luxury)', marginBottom: '2rem', fontWeight: 600 }}>Open Communication Channel</h3>
                
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-gold)' }}
                  >
                    <Sparkles size={48} style={{ margin: '0 auto 1.5rem', display: 'block', animation: 'spin 10s infinite linear' }} />
                    <h4 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Signal Received</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Transmission complete. A response will arrive shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>Name</label>
                      <input 
                        required 
                        type="text" 
                        className="interactive"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ 
                          background: 'var(--color-input-bg)', 
                          border: '1px solid var(--color-input-border)', 
                          borderRadius: '8px', 
                          padding: '1rem', 
                          color: 'var(--color-text-luxury)', 
                          outline: 'none', 
                          fontSize: '0.95rem',
                          transition: 'border-color 0.3s'
                        }} 
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-base)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-input-border)'}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>Email</label>
                      <input 
                        required 
                        type="email" 
                        className="interactive"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ 
                          background: 'var(--color-input-bg)', 
                          border: '1px solid var(--color-input-border)', 
                          borderRadius: '8px', 
                          padding: '1rem', 
                          color: 'var(--color-text-luxury)', 
                          outline: 'none', 
                          fontSize: '0.95rem',
                          transition: 'border-color 0.3s'
                        }} 
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-base)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-input-border)'}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>Message</label>
                      <textarea 
                        required 
                        rows={4} 
                        className="interactive"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ 
                          background: 'var(--color-input-bg)', 
                          border: '1px solid var(--color-input-border)', 
                          borderRadius: '8px', 
                          padding: '1rem', 
                          color: 'var(--color-text-luxury)', 
                          outline: 'none', 
                          fontSize: '0.95rem', 
                          resize: 'none',
                          transition: 'border-color 0.3s'
                        }} 
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-base)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-input-border)'}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="glass-btn interactive" 
                      style={{ 
                        padding: '1.2rem', 
                        borderRadius: '10px', 
                        fontSize: '0.9rem', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.2em', 
                        fontWeight: 600, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.8rem',
                        marginTop: '1rem'
                      }}
                    >
                      <span>Transmit Signal ✦</span>
                      <Send size={14} />
                    </button>
                  </form>
                )}
              </div>
            </AppleCard>

          </div>

          {/* Footer Rights */}
          <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '8rem', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>© 2026 Ronit Bhati — Crafted Beyond The Ordinary.</span>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#" className="interactive" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-text-luxury)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}>GitHub</a>
              <a href="#" className="interactive" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-text-luxury)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}>LinkedIn</a>
              <a href="#" className="interactive" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-text-luxury)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}>Instagram</a>
            </div>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}

export default function App() {
  // Check if intro was already played this session (i.e. this is a normal reload, not a hard reset)
  const hasPlayedIntro = sessionStorage.getItem('storyIntroPlayed');

  const [assetsLoaded, setAssetsLoaded] = useState(hasPlayedIntro ? true : false);
  const [introFinished, setIntroFinished] = useState(hasPlayedIntro ? true : false);

  // Scroll to top on normal reload
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Clear sessionStorage flag on Ctrl+Shift+R or Ctrl+F5 (Hard Refresh)
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'r' || e.key === 'R')) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'F5')
      ) {
        sessionStorage.removeItem('storyIntroPlayed');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <div className="film-grain"></div>
      
      {!assetsLoaded && <Preloader onLoaded={() => setAssetsLoaded(true)} />}

      {assetsLoaded && (
        <>
          <Cursor />
          <LivingBackground />
          {!introFinished ? (
             <StoryIntro onComplete={() => setIntroFinished(true)} />
          ) : (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
               style={{ position: 'relative', zIndex: 5 }}
             >
                <ThemeToggle />
                <AuraPicker />
                <MainSite />
             </motion.div>
          )}
        </>
      )}
    </ThemeProvider>
  );
}
