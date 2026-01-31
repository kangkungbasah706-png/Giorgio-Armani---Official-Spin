
import React, { useEffect, useState, useRef } from 'react';
import { Prize } from '../types';
import html2canvas from 'html2canvas';

interface PrizeModalProps {
  prize: Prize;
  fortune: string | null;
  onClose: () => void;
}

export const PrizeModal: React.FC<PrizeModalProps> = ({ prize, fortune, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsRendered(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const downloadVoucherPNG = async () => {
    if (!exportRef.current || isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      // 1. Wait for fonts
      if (document.fonts) {
        await document.fonts.ready;
      }
      
      // 2. Wait for rendering frames to ensure the invisible card is painted
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 3. High-quality capture (960x640)
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#0D1A16',
        scale: 3, 
        useCORS: true,
        logging: false,
        width: 960,
        height: 640,
        removeContainer: true,
      });
      
      // 4. Filename with timestamp
      const now = new Date();
      const timestamp = now.getFullYear().toString() + 
                        (now.getMonth() + 1).toString().padStart(2, '0') + 
                        now.getDate().toString().padStart(2, '0') + '-' +
                        now.getHours().toString().padStart(2, '0') + 
                        now.getMinutes().toString().padStart(2, '0');

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Voucher-${prize.label}-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloading(false);
    } catch (err) {
      console.error("Export Error:", err);
      setIsDownloading(false);
      alert('Gagal mengunduh voucher. Silakan coba lagi.');
    }
  };

  /**
   * ELITE EXPORT TEMPLATE (960x640)
   * Strictly matches the requested "Stripe & Frame" aesthetic.
   */
  const ExportVoucherTemplate = () => {
    return (
      <div 
        id="voucherExportCard"
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ 
          width: '960px', 
          height: '640px', 
          background: 'linear-gradient(to right, #0D1A16 0%, #0D1A16 35%, #2D0A0A 50%, #0D1A16 65%, #0D1A16 100%)'
        }}
      >
        {/* A) BACKGROUND EFFECTS */}
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient(circle, transparent 20%, rgba(0,0,0,0.85) 100%) pointer-events-none z-[1]"></div>
        
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-[5]" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}>
        </div>

        {/* B) HEADER AREA */}
        <div className="z-10 flex flex-col items-center space-y-3 mb-4">
          <div className="w-12 h-[0.5px] bg-[#C8A45D]/40"></div>
          <span className="text-[#e6e6e6]/60 font-montserrat text-[12px] tracking-[1.2em] font-medium uppercase select-none ml-[1.2em]">
            Official Reward
          </span>
          <div className="w-12 h-[0.5px] bg-[#C8A45D]/40"></div>
        </div>

        {/* C) MAIN FRAME (CENTER) */}
        <div className="relative z-10 w-[640px] h-[360px] flex flex-col items-center justify-center">
          {/* Outer Gold Border */}
          <div className="absolute inset-0 border-[2px] border-[#C8A45D]/60 rounded-[24px]"></div>
          {/* Inner Dashed Border */}
          <div className="absolute inset-[10px] border border-dashed border-[#C8A45D]/20 rounded-[18px]"></div>
          
          {/* D) CONTENT INSIDE FRAME */}
          <div className="relative flex flex-col items-center space-y-6">
            
            {/* Badge: Exclusive Access */}
            <div className="px-5 py-1.5 rounded-full border border-[#C8A45D]/40 bg-black/40 backdrop-blur-sm">
              <span className="text-[#C8A45D] font-montserrat text-[10px] tracking-[0.4em] font-bold uppercase select-none ml-[0.4em]">
                Exclusive Access
              </span>
            </div>

            {/* Nominal */}
            <h2 className="font-bodoni font-bold italic text-[140px] leading-none select-none tracking-tighter"
                style={{ 
                  color: '#f2e1c1',
                  textShadow: '0 10px 40px rgba(0,0,0,0.6)',
                  filter: 'drop-shadow(0 0 10px rgba(200,164,93,0.1))'
                }}>
              {prize.label}
            </h2>

            {/* Voucher Label with Lines */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-[0.5px] bg-[#C8A45D]/30"></div>
              <span className="text-[#C8A45D]/80 font-montserrat text-[16px] tracking-[1em] font-light uppercase ml-[1em] select-none">
                Voucher
              </span>
              <div className="w-16 h-[0.5px] bg-[#C8A45D]/30"></div>
            </div>
          </div>
        </div>

        {/* E) FOOTER */}
        <div className="z-10 mt-12">
          <p className="text-[#e6e6e6]/70 font-montserrat text-[11px] tracking-[0.4em] uppercase font-medium select-none text-center">
            SELAMAT ATAS BONUS VOUCHER YANG ANDA DAPATKAN.
          </p>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#C8A45D]/20 to-transparent mx-auto mt-4"></div>
        </div>

      </div>
    );
  };

  const PreviewCard = () => (
    <div className="relative w-full aspect-[3/2] flex flex-col items-center justify-center bg-[#0D1A16] overflow-hidden rounded-[4px] border border-[#C8A45D]/10">
      <div className="absolute inset-0 bg-radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%) pointer-events-none"></div>
      <div className="absolute inset-4 border border-[#C8A45D]/20 pointer-events-none"></div>
      <div className="z-10 w-[75%] flex flex-col items-center text-center space-y-6">
        <span className="text-[rgba(230,230,230,0.3)] font-montserrat text-[8px] tracking-[0.6em] uppercase">Official Reward</span>
        <div className="border border-[#C8A45D]/40 rounded-xl p-6 w-full flex flex-col items-center">
           <div className="flex flex-col items-center -space-y-1">
            <h2 className="font-bodoni font-bold italic text-[#f2e1c1] text-[64px] sm:text-[72px] leading-tight tracking-tighter">{prize.label}</h2>
            <span className="text-[#C8A45D]/50 font-montserrat text-[10px] tracking-[1em] uppercase ml-[1em]">Voucher</span>
          </div>
        </div>
        <p className="text-[rgba(230,230,230,0.4)] font-montserrat text-[6px] tracking-[0.3em] uppercase">CONGRATULATION</p>
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 bg-black/98 backdrop-blur-3xl transition-opacity duration-700 ${isRendered ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>
      
      {/* 
          OFFSCREEN RENDER ROOT (Invisible but in viewport for browser painting)
      */}
      <div 
        id="voucherExportRoot"
        className="fixed inset-0 flex items-center justify-center opacity-0 pointer-events-none z-[-1]"
        aria-hidden="true"
      >
        <div ref={exportRef} style={{ width: '960px', height: '640px' }}>
          <ExportVoucherTemplate />
        </div>
      </div>

      <div className="relative w-full max-w-[480px] flex flex-col items-center animate-scale-in" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="w-full shadow-[0_40px_100px_rgba(0,0,0,1)]">
          <PreviewCard />
        </div>

        <div className="mt-8 text-center px-4 mb-8">
          <p className="text-[#B8B8B8] font-garamond italic text-[14px] sm:text-[16px] leading-relaxed max-w-[360px] mx-auto opacity-70">
            "{fortune || `Selamat atas pencapaian istimewa Anda meraih Armani Voucher senilai ${prize.label}. Ini adalah bentuk apresiasi kami terhadap dedikasi anda.`}"
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 px-8">
          <button
            onClick={downloadVoucherPNG}
            disabled={isDownloading}
            className={`
              w-full py-4 rounded-none font-montserrat text-[10px] tracking-[0.6em] font-bold uppercase transition-all duration-300 border
              ${isDownloading 
                ? 'bg-[#1a1a1a] text-[#444444] border-[#222222] cursor-wait' 
                : 'bg-[#C8A45D] text-black border-[#C8A45D] shadow-[0_15px_30px_rgba(200,164,93,0.1)] hover:brightness-110 active:scale-95'}
            `}
          >
            {isDownloading ? 'MENYIAPKAN...' : 'UNDUH VOUCHER'}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-2 text-[#444444] font-montserrat text-[8px] tracking-[0.5em] uppercase hover:text-[#B8B8B8] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
