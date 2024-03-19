import React from 'react'
import Header from './Header';
import { DealerHand, PlayerHand } from './Hands';
import { GameProvider } from './GameContext';
import GameHistory from './GameHistory';
import Betting from './Betting';


const Game = () => {

    return (
        <GameProvider>
            <div className={`flex flex-col items-center justify-center min-h-screen bg-[url('https://static.vecteezy.com/system/resources/previews/002/582/109/original/poker-purple-background-playing-card-symbols-pattern-blackjack-vector.jpg')]`}>
                <Header />
                <div className={`flex flex-col items-center justify-center min-h-screen bg-[url('https://static.vecteezy.com/system/resources/previews/002/582/109/original/poker-purple-background-playing-card-symbols-pattern-blackjack-vector.jpg')]`}>
                    <div className={`w-[900px] h-[620px] bg-[url('https://static.vecteezy.com/system/resources/previews/024/232/274/non_2x/green-casino-poker-table-texture-game-background-free-vector.jpg')] bg-auto  rounded-xl`}>
                        <div className='flex flex-row w-full border-0 h-[330px]'>
                            <div className='w-2/3 border-0 justify-top items-center flex flex-col'>
                                <DealerHand />
                                <PlayerHand />
                            </div>

                            <GameHistory />

                        </div>

                        <Betting />

                    </div>
                </div>
            </div>
        </GameProvider>
    )
}

export default Game