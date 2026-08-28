import React, { useEffect, useState, useRef } from 'react';

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const { clientX, clientY } = e;
        // Normalize mouse coordinates from -1 to 1
        const x = (clientX / window.innerWidth - 0.5) * 2;
        const y = (clientY / window.innerHeight - 0.5) * 2;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 pointer-events-none"
    >
      {/* Soft gradient orb that follows the mouse slowly */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[100px] opacity-40 transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(255,255,255,0) 70%)',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${mousePosition.x * 60}px), calc(-50% + ${mousePosition.y * 60}px))`
        }}
      ></div>

      {/* Another secondary accent orb */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-30 transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(255,255,255,0) 70%)',
          left: '20%',
          top: '30%',
          transform: `translate(calc(-50% + ${mousePosition.x * -40}px), calc(-50% + ${mousePosition.y * -40}px))`
        }}
      ></div>

      {/* Massive Faded SD Logo */}
      <div 
        className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
        }}
      >
        <h1 className="text-[40vw] font-headline font-black text-slate-900 tracking-tighter leading-none">
          SD
        </h1>
      </div>

      {/* Forensic Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0f172a 1px, transparent 1px),
            linear-gradient(to bottom, #0f172a 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      ></div>
    </div>
  );
}
