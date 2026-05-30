/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Shuffle, Check, Users } from 'lucide-react';
import { RouletteState, Player } from '../types';

interface RouletteViewProps {
  roulette: RouletteState;
  players: Player[];
  myId: string;
  isHost: boolean;
  onSubmitTopic: (topic: string) => void;
}

export default function RouletteView({
  roulette,
  players,
  myId,
  isHost,
  onSubmitTopic,
}: RouletteViewProps) {
  const [isSpinningComplete, setIsSpinningComplete] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [topicError, setTopicError] = useState('');

  const { isSpinning, winnerId, candidateIds, finalIndex } = roulette;

  // Cinematic vertical slot measurements
  const itemHeight = 60; // 60px per slot item
  const containerHeight = 180; // 180px for exactly 3 visible items (top, center, bottom)

  // Find Winner info
  const winnerPlayer = players.find((p) => p.id === winnerId);
  const isMeWinner = winnerId === myId;

  // Sync the spinning completion locally based on standard 3.5s transition time
  useEffect(() => {
    if (isSpinning) {
      setIsSpinningComplete(false);
      const timer = setTimeout(() => {
        setIsSpinningComplete(true);
      }, 3800); // 3.8s to be safe after the css duration completes
      return () => clearTimeout(timer);
    }
  }, [isSpinning, winnerId]);

  // Handle topic confirm
  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) {
      setTopicError('주제를 입력해주세요.');
      return;
    }
    onSubmitTopic(topicInput.trim());
  };

  // Recommended topics
  const recommendedTopics = ['동물', '음식', '영화', '게임', '디저트', '스포츠', '국가', '직업', '과일', '브랜드'];

  // Calculating the center item translation positioning offset
  // - Before spinning: Centered on the first item (translateY = itemHeight)
  // - During spin: Rolls up to candidateIds.length - 4 (translateY = - (len-4) * 60)
  // - Completed: Rolls on clean finalIndex centered (translateY = - (finalIndex-1) * 60)
  const translateYValue = isSpinningComplete
    ? -((finalIndex - 1) * itemHeight)
    : isSpinning
    ? -((Math.max(4, candidateIds.length) - 4) * itemHeight)
    : itemHeight;

  // Smart dynamic transition curve:
  // - 3.5s drag-ease for high-speed cylinder blur
  // - Snappy 0.6s spring-back for satisfying click tactile settling
  const transitionStyle = !isSpinning
    ? 'none'
    : isSpinningComplete
    ? 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    : 'transform 3.5s cubic-bezier(0.12, 0.8, 0.22, 1)';

  return (
    <div className="w-full max-w-lg mx-auto bg-[#111111] p-6 rounded-xl border border-burgundy/40 shadow-2xl text-center burgundy-shadow select-none">
      <div className="mb-6">
        <span className="p-1 px-3 bg-burgundy/30 text-neonYellow border border-neonYellow/20 rounded-full font-mono text-xs uppercase font-extrabold tracking-widest animate-pulse inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neonYellow" />
          Phase 1: Topic Selector Selection
        </span>
        <h2 className="font-display font-black text-3xl text-white mt-3 uppercase tracking-wider italic">
          슬롯머신 주제 권한 추첨
        </h2>
        <p className="text-[#A0A0A0] text-xs mt-1.5 font-sans">
          슬롯에 참여자 후보 명단이 돌아갑니다! 선정된 플레이어가 제시 주제를 직접 작성합니다.
        </p>
      </div>

      {/* 3D Vertical Slot Machine Console */}
      <div className="relative py-4 px-6 bg-gradient-to-b from-[#1C0407] to-[#0A0A0A] rounded-2xl border border-burgundy/40 max-w-xs mx-auto mb-6 shadow-inner">
        
        {/* Slot Screen Container */}
        <div className="relative h-[180px] overflow-hidden border-2 border-neonYellow/35 bg-[#070707] rounded-xl flex items-center justify-center shadow-2xl border-neon-glow">
          
          {/* Glass Scanlines / Ambient Highlight Reflection */}
          <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-white/5 pointer-events-none z-20" />
          <div className="absolute inset-x-0 top-0 h-[100%] bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] pointer-events-none opacity-20 z-20" />

          {/* Neon Golden Cursor Marker (Highlighting the Center Row) */}
          <div className="absolute top-[60px] inset-x-0 h-[60px] bg-neonYellow/[0.08] border-y border-neonYellow/35 flex items-center justify-between px-2.5 pointer-events-none z-25">
            {/* Blinking Indicator Pointer Left */}
            <div className="flex items-center text-neonYellow drop-shadow-[0_0_6px_#E1FF00]">
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                className="text-base font-bold"
              >
                ▶
              </motion.span>
            </div>
            
            {/* Blinking Indicator Pointer Right */}
            <div className="flex items-center text-neonYellow drop-shadow-[0_0_6px_#E1FF00]">
              <motion.span
                animate={{ x: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                className="text-base font-bold"
              >
                ◀
              </motion.span>
            </div>
          </div>

          {/* Spherical Cylinder Ambient Shading (Vignette) */}
          <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black via-black/80 to-transparent z-15 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent z-15 pointer-events-none" />

          {/* Dynamic Scrolling Reel */}
          <div
            style={{
              transform: `translateY(${translateYValue}px)`,
              transition: transitionStyle,
            }}
            className="w-full text-center"
          >
            {candidateIds.map((pid, idx) => {
              const player = players.find((p) => p.id === pid);
              const name = player ? player.name : 'Unknown Player';
              
              // We highlight the item matching the stop sequence when completed
              const isWinnerItem = idx === finalIndex;

              return (
                <div
                  key={idx}
                  style={{ height: `${itemHeight}px` }}
                  className={`flex items-center justify-center font-display font-black tracking-wider transition-all duration-300 ${
                    isWinnerItem && isSpinningComplete
                      ? 'text-neonYellow text-xl font-extrabold text-neon-glow scale-110'
                      : 'text-white/40 text-sm scale-90 blur-[0.5px]'
                  }`}
                >
                  {name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Small Arcade Drawer Accent Line */}
        <div className="h-1.5 w-16 bg-[#1F1F1F] mx-auto rounded-b-md border-x border-b border-white/5 mt-1.5" />
      </div>

      {/* Participants Pool Roster List */}
      <div className="p-3.5 bg-black/40 border border-burgundy/20 rounded-xl max-w-xs mx-auto mb-6 text-left">
        <div className="flex items-center gap-1.5 mb-2.5 text-[11px] text-[#A0A0A0] font-sans font-extrabold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-neonYellow" />
          추첨 참가 대상 ({players.length}명)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {players.map((p) => {
            const isWinnerHere = p.id === winnerId;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-bold transition-all duration-300 ${
                  isWinnerHere && isSpinningComplete
                    ? 'bg-neonYellow/10 border-neonYellow text-neonYellow drop-shadow-[0_0_6px_rgba(225,255,0,0.15)] scale-102 font-extrabold'
                    : 'bg-burgundy/5 border-burgundy/15 text-[#909090]'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isWinnerHere && isSpinningComplete
                      ? 'bg-neonYellow animate-pulse'
                      : 'bg-white/20'
                  }`}
                />
                <span className="truncate max-w-[80px]">{p.name}</span>
                {p.id === myId && (
                  <span className="text-[9px] text-neonYellow font-mono bg-neonYellow/15 px-0.5 rounded">
                    나
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Output screen after spinning completed */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {!isSpinningComplete ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3 text-sm text-[#A0A0A0] font-sans font-bold"
            >
              <Shuffle className="w-4 h-4 text-neonYellow animate-spin" />
              참여자들을 섞어 슬롯을 회전하는 중...
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="space-y-6"
            >
              {/* Spinning Winner presentation card */}
              <div className="p-4 bg-burgundy/10 border border-burgundy/30 rounded-xl max-w-sm mx-auto">
                <div className="flex items-center justify-center gap-2 text-neonYellow mb-1 font-mono text-xs font-black">
                  <Trophy className="w-4 h-4 text-neonYellow" /> WINNER ELECTED
                </div>
                <h3 className="text-xl font-display font-black text-white">
                  {winnerPlayer ? winnerPlayer.name : 'Unknown Player'}
                </h3>
                <p className="text-xs text-[#A0A0A0] mt-1">빙고판의 제시 주제를 선정할 자격을 확보했습니다!</p>
              </div>

              {/* Action layout based on winner ownership */}
              {isMeWinner ? (
                <div className="p-5 bg-black border border-neonYellow/20 rounded-xl space-y-4 text-left">
                  <div className="flex items-center gap-1.5 text-neonYellow font-mono text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> SUBJECT PANEL
                  </div>
                  <h4 className="text-sm text-white font-sans font-extrabold">빙고 주제를 입력해 주세요.</h4>
                  
                  <form onSubmit={handleTopicSubmit} className="space-y-4">
                    <input
                      type="text"
                      maxLength={15}
                      required
                      placeholder="예시: 동물, 과일, 음식, 아이돌 이름 등"
                      value={topicInput}
                      onChange={(e) => {
                        setTopicInput(e.target.value);
                        setTopicError('');
                      }}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-burgundy/30 rounded-lg text-sm text-white focus:outline-none focus:border-neonYellow transition-colors"
                    />
                    {topicError && <p className="text-red-500 text-xs">{topicError}</p>}

                    {/* Subject Pill Recommendations */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[#A0A0A0] font-sans uppercase font-bold">추천 주제 리스트</span>
                      <div className="flex flex-wrap gap-1.5">
                        {recommendedTopics.map((rec) => (
                          <button
                            key={rec}
                            type="button"
                            onClick={() => {
                              setTopicInput(rec);
                              setTopicError('');
                            }}
                            className="bg-burgundy/10 text-[#A0A0A0] hover:text-neonYellow hover:border-neonYellow/30 border border-burgundy/20 text-[11px] px-2.5 py-1 rounded-full transition-all"
                          >
                            {rec}
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full font-display font-bold text-xs uppercase tracking-wider py-3 bg-neonYellow text-black rounded-lg cursor-pointer flex items-center justify-center gap-1 bg-yellow-300 btn-neon-glow transition-all"
                    >
                      <Check className="w-4 h-4" /> 주제 확정 적용
                    </motion.button>
                  </form>
                </div>
              ) : (
                <div className="items-center justify-center flex flex-col gap-2 p-5 bg-black border border-burgundy/10 rounded-xl max-w-sm mx-auto">
                  <div className="w-5 h-5 border-2 border-neonYellow border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-[#A0A0A0] font-sans">
                    현재 <span className="text-white font-bold">{winnerPlayer ? winnerPlayer.name : 'Unknown Player'}</span>님이
                  </p>
                  <p className="text-xs text-[#A0A0A0] font-sans">
                    어떤 주제를 선택할지 고르고 있습니다. 잠시만 대기해주세요...
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
