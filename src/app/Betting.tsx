import React from 'react'
import { useGame } from './GameContext'
import Image from 'next/image'

const StandButton = () => {
    const { gameState, computeWinner, playerHand, dealerHand } = useGame()
    return (
        <div onClick={() => { gameState == 'playing' && computeWinner(playerHand, dealerHand)}} className='bg-[white] cursor-pointer rounded-sm text-center'>
            <a href="#_" className="w-[500px] relative px-5 py-2 font-medium text-white group">
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-blue-500 group-hover:bg-blue-700 group-hover:skew-x-12"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-blue-700 group-hover:bg-blue-500 group-hover:-skew-x-12"></span>
                <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-blue-600 -rotate-12"></span>
                <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-blue-400 -rotate-12"></span>
                <span className="relative">Stand</span>
            </a>
        </div>
    )
}

const HitButton = () => {
    const { gameState, hitPlayer } = useGame()
    return (
        <div onClick={() => {gameState == 'playing' &&  hitPlayer()}} className='bg-[white] cursor-pointer rounded-sm text-center'>
            <a href="#_" className="w-[500px] relative px-5 py-2 font-medium text-white group">
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-blue-500 group-hover:bg-blue-700 group-hover:skew-x-12"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-blue-700 group-hover:bg-blue-500 group-hover:-skew-x-12"></span>
                <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-blue-600 -rotate-12"></span>
                <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-blue-400 -rotate-12"></span>
                <span className="relative">Hit</span>
            </a>
        </div>
    )
}

const Chips = () => {
    const { gameState, setBet, bet } = useGame();

    const chips = [
        { value: 10, image: '/images/red-chip.png' },
        { value: 25, image: '/images/green-chip.png' },
        { value: 50, image: '/images/blue-chip.png' },
        { value: 100, image: '/images/black-chip.png' },
    ];

    return (
        <div className='w-full border-0 p-4 flex flex-row gap-8 justify-center'>
            {chips.map((chip) => (
                <div 
                    key={chip.value}
                    onClick={() => gameState === 'betting' && setBet(chip.value)}
                    className={`cursor-pointer border-${bet === chip.value ? '2' : '0'} h-[90px] w-12 items-center flex flex-col justify-center text-center rounded-md`}
                >
                    <Image src={chip.image} width={40} alt='' height={30} />
                    <p className='text-white'>{chip.value}</p>
                </div>
            ))}
        </div>
    );
};

const BetButton = () => {
    const { gameState, setGameState, setPlayerMoney, playerMoney, bet, dealCards } = useGame()
    return (
        <div onClick={() => {
            if (gameState == 'betting') {
                dealCards()
                setGameState('playing')
                setPlayerMoney(playerMoney - bet)
            }
            }} className='cursor-pointer'>
            <a href="#_" className="relative inline-flex items-center justify-center inline-block p-2 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group w-[100px] h-[50px]">
                <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-purple-500 rounded-full blur-md ease"></span>
                <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
                <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-blue-500 rounded-full blur-md"></span>
                <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-blue-300 rounded-full blur-md"></span>
                </span>
                <span className="relative text-white">BET</span>
            </a>
        </div>
    )
}


const Betting = () => {

  
    return (
    <div className='w-2/3 items-center flex flex-col'>
        <div className='w-full flex flex-row items-center border-0 justify-center gap-8'>
            <StandButton />
            <HitButton />
        </div>

        <Chips />

        <div className='p-2'>
            <BetButton />
        </div>
    </div>
  )
}

export default Betting