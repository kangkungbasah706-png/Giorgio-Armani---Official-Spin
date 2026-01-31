
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wheel } from './components/Wheel';
import { PrizeModal } from './components/PrizeModal';
import { PRIZES } from './constants';
import { AppStatus, Prize } from './types';
import { getFortuneMessage } from './services/geminiService';

const App: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const [fortune, setFortune] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  
  const currentRotation = useRef(0);

  useEffect(() => {
    const savedSpinState = localStorage.getItem('armani_spin_used');
    if (savedSpinState === 'true') setHasSpun(true);
  }, []);

  const handleSpin = useCallback(async () => {
    if (status === AppStatus.SPINNING || hasSpun) return;

    setStatus(AppStatus.SPINNING);
    
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];
    
    const segmentAngle = 360 / PRIZES.length;
    const stopAt = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
    
    const extraSpins = 12; 
    const totalNewRotation = currentRotation.current + (extraSpins * 360) + stopAt;
    
    setRotation(totalNewRotation);
    currentRotation.current = totalNewRotation;

    const fortunePromise = getFortuneMessage(prize.label);

    setTimeout(async () => {
      const fetchedFortune = await fortunePromise;
      setWinningPrize(prize);
      setFortune(fetchedFortune);
      setStatus(AppStatus.WINNER);
      setHasSpun(true);
      localStorage.setItem('armani_spin_used', 'true');
    }, 10500);
  }, [status, hasSpun]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-between relative overflow-hidden bg-transparent animate-page-entry"
         style={{ 
           paddingTop: 'calc(1.5rem + env(safe-area-inset-top))',
           paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
           paddingLeft: '1.5rem',
           paddingRight: '1.5rem'
         }}>
      
      {/* Muted Ambient Glows */}
      <div className="absolute top-[10%] left-[-10%] w-[60%] h-[40%] bg-[#c8a45d]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] right-[-10%] w-[50%] h-[30%] bg-[#c8a45d]/3 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Header - Minimal height */}
      <header className="w-full flex flex-col items-center z-10 animate-header-entry shrink-0">
        <h1 className="font-bodoni text-2xl sm:text-4xl font-light tracking-[0.4em] text-[#e6e6e6] mb-1 uppercase text-center gold-shine">
          GIORGIO ARMANI
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-6 h-[0.5px] bg-[#c8a45d]/20"></div>
          <p className="text-[#9a9a9a] tracking-[0.4em] font-montserrat text-[6px] sm:text-[7px] uppercase font-bold">
            CONGRATULATION
          </p>
          <div className="w-6 h-[0.5px] bg-[#c8a45d]/20"></div>
        </div>
      </header>

      {/* Main - Wheel Wrapper - Flexible and centered */}
      <main className="flex-1 w-full min-h-0 flex flex-col items-center justify-center z-10 relative py-4 sm:py-8">
        {/* Soft float animation applied only to the wrapper, preserving internal wheel logic */}
        <div className={`w-full h-full max-w-[420px] max-h-[420px] flex items-center justify-center transition-all duration-1000 animate-float-container ${status === AppStatus.WINNER ? 'scale-75 opacity-0 blur-3xl pointer-events-none' : 'scale-100 opacity-100'}`}>
          <div className="w-full h-full relative flex items-center justify-center">
            <Wheel prizes={PRIZES} rotation={rotation} isSpinning={status === AppStatus.SPINNING} />
          </div>
        </div>
      </main>

      {/* Footer - Compact */}
      <footer className="w-full flex flex-col items-center gap-4 sm:gap-6 z-10 shrink-0">
        <div className="relative w-full max-w-[240px] group">
          <button
            onClick={handleSpin}
            disabled={status === AppStatus.SPINNING || hasSpun}
            className={`
              relative w-full py-3 sm:py-4 rounded-full font-montserrat text-[9px] sm:text-[10px] tracking-[0.4em] font-bold uppercase transition-all duration-500 overflow-hidden border
              ${status === AppStatus.SPINNING || hasSpun
                ? 'bg-[#1a1a1a] text-[#4d4d4d] border-[#333333] cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#0a0a0a] text-[#c8a45d] border-[#c8a45d]/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] active:scale-95 hover:-translate-y-0.5 active:translate-y-0.5 animate-btn-pulse group-hover:border-[#c8a45d]/60'}
            `}
          >
            <span className="relative z-10">
              {status === AppStatus.SPINNING ? 'PROCESSO...' : hasSpun ? '-' : 'MULAI PUTAR'}
            </span>
          </button>
        </div>
        <p className="text-[#4d4d4d] font-montserrat text-[6px] tracking-[1em] font-medium uppercase mb-2">CONGRATULATION</p>
      </footer>

      {status === AppStatus.WINNER && winningPrize && (
        <PrizeModal prize={winningPrize} fortune={fortune} onClose={() => setStatus(AppStatus.IDLE)} />
      )}
    </div>
  );
};

export default App;
