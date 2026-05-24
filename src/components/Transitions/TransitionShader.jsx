import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LiquidWipeMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 }, // 0 to 1.5
    uColor: { value: new THREE.Color('#3F72AF') }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColor;
    varying vec2 vUv;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Add noise to the UVs to make a liquid distortion
      float noise = snoise(vUv * 3.0 + uTime * 0.5);
      
      // Calculate distance from the wipe progress
      float dist = (vUv.y + noise * 0.2) - uProgress;
      
      // Create a glowing gold band that passes over the screen
      float band = smoothstep(0.1, 0.0, abs(dist));
      float alpha = band * 0.6; // Subtle glowing wipe

      gl_FragColor = vec4(uColor, alpha);
    }
  `
};

function TransitionMesh() {
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  useEffect(() => {
    // Find all sections marked for transitions
    const sections = document.querySelectorAll('.transition-section');
    
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        onEnter: () => {
           if (materialRef.current) {
             gsap.fromTo(materialRef.current.uniforms.uProgress, 
               { value: -0.2 }, 
               { value: 1.2, duration: 1.5, ease: 'power2.out' }
             );
           }
        },
        onEnterBack: () => {
           if (materialRef.current) {
             gsap.fromTo(materialRef.current.uniforms.uProgress, 
               { value: 1.2 }, 
               { value: -0.2, duration: 1.5, ease: 'power2.out' }
             );
           }
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <shaderMaterial 
        ref={materialRef} 
        attach="material" 
        args={[LiquidWipeMaterial]} 
        transparent 
        depthWrite={false}
      />
    </mesh>
  );
}

export default function TransitionShader() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 50, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <TransitionMesh />
      </Canvas>
    </div>
  );
}
