import { useEffect, useRef } from 'react';
import { useTheme } from '../../useTheme';

export default function LivingBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const scrollRef = useRef(0);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  // Keep themeRef synced without restarting the animation loop
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let clouds = [];
    const particleCount = 75;
    const connectionDistance = 110;
    const mouseRadius = 150;
    const cloudCount = 5;

    // Beam angle tracking
    let currentBeamAngle = -Math.PI / 4;

    // Smooth theme transition interpolation (0 = dark, 1 = light)
    let themeBlend = 0;

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      initClouds();
    };

    // Color palettes for particles
    const darkColors = [
      'rgba(219, 226, 239, ',
      'rgba(59, 130, 246, ',
      'rgba(147, 51, 234, ',
      'rgba(248, 250, 252, '
    ];

    const lightColors = [
      'rgba(37, 99, 235, ',   // rich blue
      'rgba(59, 130, 246, ',  // sky blue
      'rgba(14, 165, 233, ',  // cyan
      'rgba(15, 23, 42, '     // dark navy dot
    ];

    // Initialize Particles
    const initParticles = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < particleCount; i++) {
        const anchorX = Math.random() * w;
        const anchorY = Math.random() * h;

        particles.push({
          anchorX,
          anchorY,
          x: anchorX,
          y: anchorY,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.6 + 0.6,
          depth: Math.random() * 0.75 + 0.1,
          colorIndex: Math.floor(Math.random() * darkColors.length)
        });
      }
    };

    // Initialize Clouds
    const initClouds = () => {
      clouds = [];
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.4 + h * 0.1,
          vx: Math.random() * 0.12 + 0.05,
          scale: Math.random() * 1.4 + 0.6,
          opacity: Math.random() * 0.5 + 0.5,
          depth: 0.45
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const getMountainY = (x, width, base, amp, freq) => {
      return (
        base +
        Math.sin(x * freq) * amp +
        Math.sin(x * freq * 2.3) * (amp * 0.4) +
        Math.sin(x * freq * 5.1) * (amp * 0.15)
      );
    };

    // Helpers: Interpolate between two rgb colors
    const lerpColor = (r1, g1, b1, r2, g2, b2, t) => {
      return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`;
    };

    // Animation Loop
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const scrollY = scrollRef.current;
      const mouse = mouseRef.current;
      const isLight = themeRef.current === 'light';

      // Smoothly transition themeBlend towards target
      const targetBlend = isLight ? 1 : 0;
      themeBlend += (targetBlend - themeBlend) * 0.035; // smooth ~0.6s transition

      const tb = themeBlend; // shorthand

      ctx.clearRect(0, 0, w, h);

      // 1. DRAW DYNAMIC SKY GRADIENT
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      const scrollFactor = Math.min(scrollY / (h * 1.5), 1.0);

      // DARK sky stops
      const dTop = [2, 5, 11];
      const dMid = [8 - 6 * scrollFactor, 16 - 12 * scrollFactor, 38 - 28 * scrollFactor];
      const dBot = [22 - 20 * scrollFactor, 41 - 37 * scrollFactor, 74 - 68 * scrollFactor];

      // LIGHT morning sky stops (warm sunrise gradient)
      const lTop = [135, 206, 250]; // soft sky blue
      const lMid = [200 + 20 * scrollFactor, 220 + 15 * scrollFactor, 245];
      const lBot = [255 - 30 * scrollFactor, 200 - 40 * scrollFactor, 140 - 30 * scrollFactor]; // golden horizon

      skyGrad.addColorStop(0, lerpColor(dTop[0], dTop[1], dTop[2], lTop[0], lTop[1], lTop[2], tb));
      skyGrad.addColorStop(0.5, lerpColor(dMid[0], dMid[1], dMid[2], lMid[0], lMid[1], lMid[2], tb));
      skyGrad.addColorStop(1.0, lerpColor(dBot[0], dBot[1], dBot[2], lBot[0], lBot[1], lBot[2], tb));

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw a subtle sun in light mode (top right area)
      if (tb > 0.05) {
        const sunX = w * 0.78;
        const sunY = h * 0.12;
        const sunRadius = 45;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 5);
        sunGrad.addColorStop(0, `rgba(255, 220, 100, ${0.95 * tb})`);
        sunGrad.addColorStop(0.08, `rgba(255, 200, 60, ${0.7 * tb})`);
        sunGrad.addColorStop(0.25, `rgba(255, 180, 50, ${0.15 * tb})`);
        sunGrad.addColorStop(1, `rgba(255, 180, 50, 0)`);
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 5, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.fill();

        // Solid sun disc
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 180, ${tb * 0.95})`;
        ctx.shadowBlur = 60 * tb;
        ctx.shadowColor = `rgba(255, 200, 60, ${tb * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Space visibility transitions
      const spaceVisibility = Math.min(0.25 + scrollFactor * 0.75, 1.0) * (1 - tb * 0.7);

      // 2. STARS AND CONSTELLATIONS
      const activeColors = isLight ? lightColors : darkColors;

      particles.forEach((p) => {
        p.anchorX += p.vx;
        p.anchorY += p.vy;

        if (p.anchorX < 0) p.anchorX = w;
        if (p.anchorX > w) p.anchorX = 0;
        if (p.anchorY < 0) p.anchorY = h;
        if (p.anchorY > h) p.anchorY = 0;

        const parallaxY = (p.anchorY - scrollY * p.depth) % h;
        const finalAnchorY = parallaxY < 0 ? h + parallaxY : parallaxY;

        let targetX = p.anchorX;
        let targetY = finalAnchorY;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            const pushX = (dx / dist) * force * -60 * p.depth;
            const pushY = (dy / dist) * force * -60 * p.depth;
            targetX = p.anchorX + pushX;
            targetY = finalAnchorY + pushY;
          }
        }

        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        const color = activeColors[p.colorIndex];
        const alpha = p.depth * 0.65 * spaceVisibility;
        if (alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = color + alpha + ')';
          ctx.shadowBlur = p.depth > 0.5 ? 8 : 0;
          ctx.shadowColor = color.replace('rgba', 'rgb').split(',').slice(0, 3).join(',') + ')';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Constellation lines
      if (spaceVisibility > 0.05) {
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];

            if (Math.abs(p1.depth - p2.depth) > 0.25) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
              const avgDepth = (p1.depth + p2.depth) / 2;
              const opacity = (1 - dist / connectionDistance) * 0.18 * avgDepth * spaceVisibility;

              if (opacity > 0.005) {
                const color = activeColors[p1.colorIndex];
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = color + opacity + ')';
                ctx.lineWidth = 0.55 * avgDepth;
                ctx.stroke();
              }
            }
          }
        }
      }

      // 3. FAR MOUNTAINS (Depth: 0.15)
      const farMountainYOffset = scrollY * 0.15;
      const farMountainBaseY = h * 0.58;
      const farMountainAmp = h * 0.13;
      const farMountainFreq = 0.0022;

      if (farMountainBaseY + farMountainYOffset - farMountainAmp < h) {
        const farGrad = ctx.createLinearGradient(0, farMountainBaseY + farMountainYOffset - farMountainAmp, 0, h);
        // Dark: deep indigo. Light: soft misty blue-green
        farGrad.addColorStop(0, lerpColor(16, 27, 48, 130, 170, 195, tb));
        farGrad.addColorStop(1, lerpColor(5, 10, 18, 100, 150, 175, tb));

        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 10) {
          const y = getMountainY(x, w, farMountainBaseY + farMountainYOffset, farMountainAmp, farMountainFreq);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = farGrad;
        ctx.fill();
      }

      // 4. FLOATING CLOUDS (Depth: 0.45)
      clouds.forEach((c) => {
        c.x += c.vx;
        if (c.x > w + 200 * c.scale) c.x = -200 * c.scale;

        const cy = c.y + scrollY * c.depth;
        if (cy > -100 && cy < h + 100) {
          ctx.beginPath();
          // Light mode: fluffy white clouds. Dark: subtle ghost clouds
          const cloudAlpha = isLight ? c.opacity * 0.35 : c.opacity * 0.045;
          ctx.fillStyle = `rgba(255, 255, 255, ${cloudAlpha})`;
          const r = 26 * c.scale;
          ctx.arc(c.x, cy, r, 0, Math.PI * 2);
          ctx.arc(c.x + r * 0.8, cy - r * 0.25, r * 1.3, 0, Math.PI * 2);
          ctx.arc(c.x + r * 1.75, cy, r * 0.95, 0, Math.PI * 2);
          ctx.arc(c.x + r * 0.9, cy + r * 0.35, r * 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 5. MID-GROUND HILLS (Depth: 0.35)
      const midHillYOffset = scrollY * 0.35;
      const midHillBaseY = h * 0.72;
      const midHillAmp = h * 0.085;
      const midHillFreq = 0.0055;

      if (midHillBaseY + midHillYOffset - midHillAmp < h) {
        const midGrad = ctx.createLinearGradient(0, midHillBaseY + midHillYOffset - midHillAmp, 0, h);
        // Dark: dark navy. Light: warm green hills
        midGrad.addColorStop(0, lerpColor(11, 17, 34, 75, 140, 85, tb));
        midGrad.addColorStop(1, lerpColor(3, 5, 12, 55, 115, 65, tb));

        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) {
          const y = getMountainY(x, w, midHillBaseY + midHillYOffset, midHillAmp, midHillFreq);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = midGrad;
        ctx.fill();

        // Electronic pine towers on hills
        const towerPositions = [0.18, 0.38, 0.52, 0.76, 0.88];
        towerPositions.forEach((ratio) => {
          const tx = w * ratio;
          const ty = getMountainY(tx, w, midHillBaseY + midHillYOffset, midHillAmp, midHillFreq);

          if (ty < h) {
            // Trunk
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx, ty - 32);
            // Dark: blue line. Light: earthy brown line
            ctx.strokeStyle = lerpColor(59, 130, 246, 90, 70, 50, tb).replace('rgb', 'rgba').replace(')', `, ${0.25 + tb * 0.35})`);
            ctx.lineWidth = 1;
            ctx.stroke();

            // Pulsing tip node
            const pulse = 2.5 + Math.sin(Date.now() * 0.003 + ratio * 10) * 1.2;
            ctx.beginPath();
            ctx.arc(tx, ty - 32, pulse, 0, Math.PI * 2);
            // Dark: violet glow. Light: warm golden-green glow
            const tipR = Math.round(147 + (50 - 147) * tb);
            const tipG = Math.round(51 + (160 - 51) * tb);
            const tipB = Math.round(234 + (60 - 234) * tb);
            ctx.fillStyle = `rgba(${tipR}, ${tipG}, ${tipB}, 0.85)`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgb(${tipR}, ${tipG}, ${tipB})`;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      // 6. FOREGROUND CLIFF & LIGHTHOUSE (Depth: 0.60)
      const foreGroundYOffset = scrollY * 0.60;
      const foreBaseY = h * 0.86;
      const foreAmp = h * 0.045;
      const foreFreq = 0.009;

      if (foreBaseY + foreGroundYOffset - foreAmp < h) {
        const lighthouseX = w * 0.22;
        const lighthouseY = getMountainY(lighthouseX, w, foreBaseY + foreGroundYOffset, foreAmp, foreFreq);

        // Lighthouse beam (rendered behind structures)
        if (lighthouseY < h) {
          const bx = lighthouseX;
          const by = lighthouseY - 40;

          let targetAngle;
          if (mouse.active) {
            targetAngle = Math.atan2(mouse.y - by, mouse.x - bx);
            if (targetAngle > 0 && targetAngle < Math.PI / 2) {
              targetAngle = -0.05;
            } else if (targetAngle >= Math.PI / 2 && targetAngle < Math.PI) {
              targetAngle = -Math.PI + 0.05;
            }
          } else {
            targetAngle = -Math.PI / 2 + Math.sin(Date.now() * 0.0006) * (Math.PI / 3.8);
          }

          currentBeamAngle += (targetAngle - currentBeamAngle) * 0.085;

          const beamLength = Math.max(w, h) * 1.35;
          const beamSpread = 0.11;

          const lx = bx + Math.cos(currentBeamAngle - beamSpread) * beamLength;
          const ly = by + Math.sin(currentBeamAngle - beamSpread) * beamLength;
          const rx = bx + Math.cos(currentBeamAngle + beamSpread) * beamLength;
          const ry = by + Math.sin(currentBeamAngle + beamSpread) * beamLength;

          const beamGrad = ctx.createRadialGradient(bx, by, 0, bx, by, beamLength);
          // Dark: neon blue beam. Light: warm golden beam
          const beamR = Math.round(59 + (255 - 59) * tb);
          const beamG = Math.round(130 + (200 - 130) * tb);
          const beamB = Math.round(246 + (60 - 246) * tb);
          beamGrad.addColorStop(0, `rgba(${beamR}, ${beamG}, ${beamB}, 0.45)`);
          beamGrad.addColorStop(0.15, `rgba(${beamR}, ${beamG}, ${beamB}, 0.16)`);
          beamGrad.addColorStop(0.5, `rgba(${beamR}, ${beamG}, ${beamB}, 0.04)`);
          beamGrad.addColorStop(1.0, `rgba(${beamR}, ${beamG}, ${beamB}, 0.0)`);

          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(lx, ly);
          ctx.lineTo(rx, ry);
          ctx.closePath();
          ctx.fillStyle = beamGrad;
          ctx.fill();
        }

        // Foreground cliff
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 6) {
          const y = getMountainY(x, w, foreBaseY + foreGroundYOffset, foreAmp, foreFreq);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        // Dark: near black. Light: earthy brown-green
        ctx.fillStyle = lerpColor(3, 5, 9, 45, 75, 45, tb);
        ctx.fill();

        // Lighthouse structure
        if (lighthouseY < h) {
          const bx = lighthouseX;
          const by = lighthouseY;

          // Dark: near black. Light: warm stone tan
          const structColor = lerpColor(3, 5, 9, 180, 160, 140, tb);
          ctx.fillStyle = structColor;

          // Base block
          ctx.beginPath();
          ctx.rect(bx - 16, by, 32, 6);
          ctx.fill();

          // Main vertical tower
          ctx.beginPath();
          ctx.moveTo(bx - 10, by);
          ctx.lineTo(bx - 6, by - 34);
          ctx.lineTo(bx + 6, by - 34);
          ctx.lineTo(bx + 10, by);
          ctx.closePath();
          ctx.fill();

          // Platform rail
          ctx.beginPath();
          ctx.rect(bx - 9, by - 36, 18, 2);
          ctx.fill();

          // Glass house & roof dome
          ctx.beginPath();
          ctx.rect(bx - 4, by - 42, 8, 6);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(bx, by - 42, 4, Math.PI, 0);
          ctx.fill();

          // Beacon light
          ctx.beginPath();
          ctx.arc(bx, by - 39, 2.5, 0, Math.PI * 2);
          const beaconColor = lerpColor(251, 191, 36, 255, 200, 60, tb);
          ctx.fillStyle = beaconColor;
          ctx.shadowBlur = 18;
          ctx.shadowColor = beaconColor;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1,
      overflow: 'hidden',
      background: theme === 'light' ? '#87CEEF' : '#02050b',
      transition: 'background 0.8s ease',
    }}>
      {/* Background blur shapes */}
      <div className="aurora-bg" style={{ opacity: theme === 'light' ? 0.08 : 0.18, pointerEvents: 'none', transition: 'opacity 0.8s ease' }}>
        <div className="aurora-blob aurora-1"></div>
        <div className="aurora-blob aurora-2"></div>
        <div className="aurora-blob aurora-3"></div>
      </div>

      {/* 2D Landscape & Space World Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          willChange: 'transform'
        }}
      />
    </div>
  );
}
