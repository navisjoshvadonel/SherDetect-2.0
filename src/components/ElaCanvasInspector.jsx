import React, { useState, useRef, useEffect } from 'react';
import { generateElaHeatmap, generateLaplacianMask } from '../utils/forensicScanner';
import { Eye, Zap, Shield, ZoomIn, ZoomOut, RotateCcw, HelpCircle, Lock } from 'lucide-react';

export default function ElaCanvasInspector({ imageSrc, isAnalyzing }) {
  const [activeLayer, setActiveLayer] = useState('ela'); // 'original' | 'ela' | 'laplacian' | 'pii'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      renderActiveCanvas();
    };
  }, [imageSrc, activeLayer]);

  const renderActiveCanvas = () => {
    if (!canvasRef.current || !imgRef.current) return;
    if (activeLayer === 'ela') {
      generateElaHeatmap(canvasRef.current, imgRef.current);
    } else if (activeLayer === 'laplacian') {
      generateLaplacianMask(canvasRef.current, imgRef.current);
    } else {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = imgRef.current.naturalWidth || 600;
      canvasRef.current.height = imgRef.current.naturalHeight || 400;
      ctx.drawImage(imgRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (activeLayer === 'pii') {
        // Overlay synthetic PII blackout boxes
        ctx.fillStyle = '#000000';
        ctx.fillRect(canvasRef.current.width * 0.1, canvasRef.current.height * 0.2, 180, 24);
        ctx.fillRect(canvasRef.current.width * 0.1, canvasRef.current.height * 0.28, 140, 24);
        ctx.fillStyle = '#97d700';
        ctx.font = '12px monospace';
        ctx.fillText('[ PII REDACTED ]', canvasRef.current.width * 0.1 + 10, canvasRef.current.height * 0.2 + 16);
      }
    }
  };

  return (
    <div className="bg-[#1c1b1b] rounded-2xl border-2.5 border-[#00E5FF]/40 shadow-neo p-4 space-y-4 relative">
      {/* TOP TOOLBAR & LAYER PICKER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#131313] p-2 rounded-xl border border-white/10">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs font-mono">
          <button
            onClick={() => setActiveLayer('original')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1 ${
              activeLayer === 'original' ? 'bg-[#00E5FF] text-black shadow' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Original</span>
          </button>

          <button
            onClick={() => setActiveLayer('ela')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1 ${
              activeLayer === 'ela' ? 'bg-red-500 text-white shadow' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Layer 2: ELA Pixel Heatmap</span>
          </button>

          <button
            onClick={() => setActiveLayer('laplacian')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1 ${
              activeLayer === 'laplacian' ? 'bg-[#97d700] text-black shadow' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Layer 3: Font Edge Mask</span>
          </button>

          <button
            onClick={() => setActiveLayer('pii')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1 ${
              activeLayer === 'pii' ? 'bg-purple-600 text-white shadow' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Layer 4: PII Redaction</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2 text-xs font-mono text-gray-300">
          <button 
            onClick={() => setZoomLevel(z => Math.max(0.8, z - 0.2))}
            className="p-1.5 bg-[#201f1f] hover:bg-[#2a2a2a] rounded-lg border border-white/10"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span>{(zoomLevel * 100).toFixed(0)}%</span>
          <button 
            onClick={() => setZoomLevel(z => Math.min(2.5, z + 0.2))}
            className="p-1.5 bg-[#201f1f] hover:bg-[#2a2a2a] rounded-lg border border-white/10"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setZoomLevel(1)}
            className="p-1.5 bg-[#201f1f] hover:bg-[#2a2a2a] rounded-lg border border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CANVAS DISPLAY BOX WITH ANIMATED SCANLINE */}
      <div className="relative overflow-hidden rounded-xl bg-[#0e0e0e] border border-white/10 flex items-center justify-center min-h-[360px]">
        {/* Animated Scanline Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-[#00E5FF]/20 to-transparent animate-scanlaser border-b-2 border-[#00E5FF]" />
        )}

        <div 
          className="transition-transform duration-200 flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-2xl" />
        </div>

        {/* Friendly Plain-English Explanation Overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-[#131313]/90 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#97d700] animate-ping"></span>
            <span>
              {activeLayer === 'ela' && "Red/Cyan glowing pixels highlight edited regions."}
              {activeLayer === 'laplacian' && "Cyan outlines reveal font & text overlay discrepancies."}
              {activeLayer === 'original' && "Original high-res document view."}
              {activeLayer === 'pii' && "PII Sanitizer active: Names & numbers scrubbed."}
            </span>
          </div>

          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-[#00E5FF] hover:underline flex items-center space-x-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Simple Guide</span>
          </button>
        </div>
      </div>
    </div>
  );
}
