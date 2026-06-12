'use client';

import { useState } from 'react';
import { useGuessingGame } from '../hooks/useGuessingGame';

export const Game = () => {
  const { gameState, guess, resetGame } = useGuessingGame();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputValue, 10);
    guess(num);
    setInputValue('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">猜數字遊戲</h1>

        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700">{gameState.message}</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
            <span>猜測次數: {gameState.attempts} / 10</span>
            <span>區間: {gameState.minRange} - {gameState.maxRange}</span>
          </div>
        </div>

        {!gameState.isGameOver ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="輸入一個數字 (1-100)"
              min={1}
              max={100}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              確認
            </button>
          </form>
        ) : (
          <button
            onClick={resetGame}
            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            重新開始
          </button>
        )}
      </div>
    </div>
  );
};
