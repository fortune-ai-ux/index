/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, MousePointer2, RotateCcw, Trophy, Zap } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('click_speed_highscore');
    return saved ? parseFloat(saved) : 0;
  });

  const startGame = () => {
    setClicks(0);
    setTimeLeft(10);
    setGameState('playing');
  };

  const handleClick = () => {
    if (gameState === 'playing') {
      setClicks((prev) => prev + 1);
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            setGameState('finished');
            return 0;
          }
          return Math.max(0, prev - 0.1);
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'finished') {
      const cps = clicks / 10;
      if (cps > highScore) {
        setHighScore(cps);
        try {
          localStorage.setItem('click_speed_highscore', cps.toString());
        } catch (e) {
          console.error('Failed to save high score', e);
        }
      }
    }
  }, [gameState, clicks, highScore]);

  const cps = (clicks / 10).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-black tracking-tighter uppercase mb-2 flex items-center justify-center gap-3">
          <Zap className="text-yellow-500 fill-yellow-500" size={40} />
          手速測試
        </h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm opacity-60">
          Click Speed Test • 10 Seconds Challenge
        </p>
      </motion.div>

      <main className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 text-center"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white">
                  <MousePointer2 size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">準備好了嗎？</h2>
              <p className="text-gray-500 mb-8">點擊下方按鈕開始測試，你有 10 秒的時間瘋狂點擊！</p>
              <button
                id="start-btn"
                onClick={startGame}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold text-xl hover:bg-gray-800 transition-colors active:scale-95 transform"
              >
                開始測試
              </button>
              {highScore > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 font-medium">
                  <Trophy size={16} className="text-yellow-500" />
                  最高紀錄: {highScore.toFixed(1)} CPS
                </div>
              )}
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-full flex justify-between items-end mb-8 px-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Time</span>
                  <div className="flex items-center gap-2 text-3xl font-mono font-bold">
                    <Timer size={24} className={timeLeft < 3 ? 'text-red-500 animate-pulse' : ''} />
                    {timeLeft.toFixed(1)}s
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clicks</span>
                  <div className="text-5xl font-black tabular-nums">
                    {clicks}
                  </div>
                </div>
              </div>

              <button
                id="click-target"
                onMouseDown={handleClick}
                className="w-full aspect-square bg-white rounded-[40px] shadow-2xl border-b-8 border-gray-200 flex flex-col items-center justify-center active:border-b-0 active:translate-y-2 transition-all group"
              >
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center group-active:scale-90 transition-transform shadow-inner">
                  <Zap size={48} className="text-white fill-white" />
                </div>
                <span className="mt-6 text-xl font-black uppercase tracking-widest text-gray-300 group-active:text-yellow-500 transition-colors">
                  CLICK!
                </span>
              </button>
            </motion.div>
          )}

          {gameState === 'finished' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 text-center"
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full mb-4">
                  <Trophy size={32} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">測試結束！</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">總點擊數</div>
                  <div className="text-4xl font-black">{clicks}</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">CPS</div>
                  <div className="text-4xl font-black text-yellow-600">{cps}</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  id="restart-btn"
                  onClick={startGame}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold text-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  再試一次
                </button>
                <button
                  onClick={() => setGameState('idle')}
                  className="w-full py-4 bg-white text-gray-400 rounded-2xl font-bold hover:text-gray-600 transition-colors"
                >
                  返回主選單
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer info */}
      <footer className="mt-12 text-gray-400 text-xs font-medium uppercase tracking-widest">
        Speed is everything • Challenge your limits
      </footer>
    </div>
  );
}
