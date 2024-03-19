import { Miltonian } from 'next/font/google'
import React from 'react'
import { useGame } from './GameContext';
import GameService from '../../services/gameService';
import { GameHistoryItem } from '../../services/types/gameTypes';

const miltonian = Miltonian({
    weight: '400',
    subsets: ['latin'],
  })

const GameHistory = () => {


    const {playerMoney, history, gameOutcome, animationTimeout} = useGame();

  return (
    <div className='w-1/3 mt-2 h-[320px] border-2 rounded-md mr-2 flex flex-col'>
        <div className='w-full p-2 text-white'>
            <p className={`${miltonian.className}`}>{playerMoney} mETH</p>
        </div>
        <div style={{backgroundColor: GameService.mapGameOutcomeToColor(gameOutcome!)}} className={`${animationTimeout && 'animate-bounce'} w-full border-y-2 text-center p-2`}>
            <p className='text-white'>{gameOutcome || 'Awaiting Game Outcome'}</p>
        </div>
        <div className='w-full px-0 border-b-2 flex text-white'>
            <p className='w-[190px] ml-2'>Game History</p>
            <p>Bet</p>
            <p className='ml-2'>Payout</p>
        </div>
        <div className='flex flex-col overflow-scroll no-scrollbar'>
            {history.map((item : GameHistoryItem, index: number) => (
                <div style={{backgroundColor: GameService.mapGameOutcomeToColor(item.outcome)}} key={index} className={`flex text-white justify-between  px-2 border-b-2`}>
                    <p className='w-2/3'>{item.outcome}</p>
                    <p className='w-1/6'>{item.bet}</p>
                    <p className='w-1/6'>{item.payout}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default GameHistory