'use client';

import { useState, useCallback } from 'react';

export interface GameState {
  targetNumber: number;
  attempts: number;
  message: string;
  isGameOver: boolean;
  isWin: boolean;
  minRange: number;
  maxRange: number;
}

const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

export const useGuessingGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    targetNumber: generateRandomNumber(),
    attempts: 0,
    message: '請開始猜一個 1 到 100 之間的數字',
    isGameOver: false,
    isWin: false,
    minRange: 1,
    maxRange: 100,
  });

  const resetGame = useCallback(() => {
    setGameState({
      targetNumber: generateRandomNumber(),
      attempts: 0,
      message: '遊戲已重置，請再次猜一個 1 到 100 之間的數字',
      isGameOver: false,
      isWin: false,
      minRange: 1,
      maxRange: 100,
    });
  }, []);

  const guess = useCallback((userGuess: number) => {
    if (gameState.isGameOver) return;

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setGameState((prev) => ({ ...prev, message: '請輸入 1 到 100 之間的數字！' }));
      return;
    }

    const nextAttempts = gameState.attempts + 1;
    let nextMessage = '';
    let nextIsWin = false;
    let nextIsGameOver = false;
    let nextMin = gameState.minRange;
    let nextMax = gameState.maxRange;

    if (userGuess === gameState.targetNumber) {
      nextMessage = `恭喜你！猜對了！目標數字是 ${gameState.targetNumber}。`;
      nextIsWin = true;
      nextIsGameOver = true;
    } else if (userGuess < gameState.targetNumber) {
      nextMessage = '太小了！';
      nextMin = Math.max(userGuess + 1, gameState.minRange);
    } else {
      nextMessage = '太大了！';
      nextMax = Math.min(userGuess - 1, gameState.maxRange);
    }

    if (nextAttempts >= 10 && !nextIsWin) {
      nextMessage = `遊戲結束！次數耗盡，目標數字是 ${gameState.targetNumber}。`;
      nextIsGameOver = true;
    }

    setGameState((prev) => ({
      ...prev,
      attempts: nextAttempts,
      message: nextMessage,
      isWin: nextIsWin,
      isGameOver: nextIsGameOver,
      minRange: nextMin,
      maxRange: nextMax,
    }));
  }, [gameState.attempts, gameState.targetNumber, gameState.isGameOver, gameState.minRange, gameState.maxRange]);

  return { gameState, guess, resetGame };
};
