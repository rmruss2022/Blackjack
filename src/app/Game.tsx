import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { CardPullResponse, DeckAPIResponse, DrawnCard } from '../../services/types/deckOfCardsTypes';
import { GameHistoryItem, GameOutcome } from '../../services/types/gameTypes';
import { DeckOfCardsService } from '../../services/deckOfCardsAPIService';
import GameService from '../../services/gameService';
import Image from 'next/image'
import { ConnectWallet } from "@thirdweb-dev/react";
import { Bonbon , Miltonian} from 'next/font/google'

const bonbon = Bonbon({
  weight: '400',
  subsets: ['latin'],
})

const stardos = Miltonian({
  weight: '400',
  subsets: ['latin'],
})

const Hand = ({ cards }: {cards: DrawnCard[]}) => {
    return (
      <div className='flex gap-2'>
        {cards.map((card: DrawnCard, index: number) => (
          <Image key={index} src={card.image || ''} alt='' width={70} height={80}  />
        ))}
      </div>
    );
  };


const Game = () => {


    const [gameState, setGameState] = useState<string>('betting'); // ['betting', 'playing', 'gameover'
    const [playerHand, setPlayerHand] = useState<DrawnCard[]>([]);
    const [dealerHand, setDealerHand] = useState<DrawnCard[]>([]);
    const [deck, setDeck] = useState<DeckAPIResponse>({success: true, deck_id: '', remaining: 0, shuffled: false}); // Placeholder cards
    const [history, setHistory] = useState<GameHistoryItem[]>([]); 
    const [bet, setBet] = useState<number>(10); 
    const [playerMoney, setPlayerMoney] = useState<number>(1000); 
    const [gameOutcome, setGameOutcome] = useState<GameOutcome>();
    const [animationTimeout, setAnimationTimeout] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    


    const handleGetBackground = () => {
        const ret = GameService.mapGameOutcomeToColor(gameOutcome!);
        console.log('mapped color: ', ret)
        return ret;
    }

    const handleHistoryGetBackground = (outcome: GameOutcome) => {
        const ret = GameService.mapGameOutcomeToColor(outcome!)
        return ret;
    }



    useEffect(() => {
        const fetchDeck = async () => {
            const deckResponse = await DeckOfCardsService.getShuffledDeck();
            setDeck(deckResponse);
        };
        if (loading) {
            fetchDeck();
            setLoading(false)
        }
        if (playerMoney <= 0 && gameState == 'betting') {
            setGameState('gameover');
        }
    }
    , [playerMoney]);

    const determinePayout = (outcome: GameOutcome): number => {
        let payout = 0; // Default payout for loss
    
        if (outcome === GameOutcome.PlayerWin || outcome === GameOutcome.DealerBust) {
            // Check for blackjack on win
            if (playerHand.length === 2 && playerHand[0].value === 'ACE' && ['10', 'JACK', 'QUEEN', 'KING'].includes(playerHand[1].value)) {
                payout = bet * 1.5; // Blackjack pays 3:2
            } else {
                payout = bet; // Regular win pays 1:1
            }
            payout += bet; // Return the original bet
            setPlayerMoney(playerMoney + payout); // Update player money with payout
        } else if (outcome === GameOutcome.Tie || outcome === GameOutcome.PlayerAndDealerBust) {
            payout = bet; // In case of a tie, the player gets back their bet
            setPlayerMoney(playerMoney + bet);
        }
        // In case of a loss, no adjustment is needed since payout remains 0 and playerMoney remains unchanged
    
        return payout;
    }

    const hitPlayer = async () => {
        const cardPullResponse = await DeckOfCardsService.drawCards(deck.deck_id, 1);
        const newCard = cardPullResponse.cards[0];
        const updatedPlayerHand = [...playerHand, newCard];
        setPlayerHand(updatedPlayerHand);

        // manually check for bust instead of using the determineWinner 
        // function because of updated hand, optionally change useState to ref
        if (GameService.computeHandSum(updatedPlayerHand) > 21) {
            const gameOutcome = GameService.determineWinner(updatedPlayerHand, dealerHand);
            setGameOutcome(gameOutcome);
            setAnimationTimeout(true);
            setTimeout(() => setAnimationTimeout(false), 3000);
            const payout = determinePayout(gameOutcome);
            setHistory([
                {
                    playerHand, 
                    dealerHand, 
                    outcome: gameOutcome, 
                    bet: bet,
                    payout: payout,
                    datetime: new Date().toISOString() 
                },
                ...history,
            ]);
            setGameState('betting');
        }
        
    }


    const computeWinner = () => {
        console.log('computing winner')
        const gameOutcome = GameService.determineWinner(playerHand, dealerHand);
        setGameOutcome(gameOutcome);
        setAnimationTimeout(true);
        setTimeout(() => setAnimationTimeout(false), 3000);
        const payout = determinePayout(gameOutcome);
        setHistory([ 
            { 
                playerHand: playerHand, 
                dealerHand: dealerHand, 
                outcome: gameOutcome, 
                bet: bet,
                payout: payout,
                datetime: new Date().toISOString() 
            },
            ...history,
        ]);
        setGameState('betting');
    }
    
    const dealCards = async () => {
    
        // Draw 2 cards for the player and 2 for the dealer, check if shuffle is required
        let playerDrawResponse = await DeckOfCardsService.drawCards(deck.deck_id, 2);
        if (playerDrawResponse.success == false && playerDrawResponse.remaining < 2) {
            await GameService.shuffleDeck(deck.deck_id);
            playerDrawResponse = await DeckOfCardsService.drawCards(deck.deck_id, 2);
        }
        
        let dealerDrawResponse = await DeckOfCardsService.drawCards(deck.deck_id, 2);
        if (dealerDrawResponse.success == false && dealerDrawResponse.remaining < 2) {
            await GameService.shuffleDeck(deck.deck_id);
            dealerDrawResponse = await DeckOfCardsService.drawCards(deck.deck_id, 2);
        }
        
    
        // Update hands if the draw was successful
        if (playerDrawResponse.success && dealerDrawResponse.success) {
            setPlayerHand(playerDrawResponse.cards);
            setDealerHand(dealerDrawResponse.cards);
            console.log(playerDrawResponse.cards, dealerDrawResponse.cards)
        } else {
            console.error('Failed to draw cards.');
        }
        
        // check for blackjack
        const playerSum = GameService.computeHandSum(playerDrawResponse.cards);
        const dealerSum = GameService.computeHandSum(dealerDrawResponse.cards);

        console.log('playerSum: ', playerSum, 'dealerSum: ', dealerSum)

        if (playerSum === 21 || dealerSum === 21) {
            computeWinner();
        }
    };
    
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-[url('https://static.vecteezy.com/system/resources/previews/002/582/109/original/poker-purple-background-playing-card-symbols-pattern-blackjack-vector.jpg')]`}>
        <div className="w-[900px] flex items-center border-0 h-[60px] fixed top-0">
            <div className="flex-grow"></div>
                <p className={`${bonbon.className} text-4xl font-bold text-white mx-auto absolute w-full text-center`}>Bitcoin Blackjack</p>
                <div className="flex-grow"></div>
                <div className="ml-auto z-10">
                    <ConnectWallet />
                </div>
        </div>


    <div className={`flex flex-col items-center justify-center min-h-screen bg-[url('https://static.vecteezy.com/system/resources/previews/002/582/109/original/poker-purple-background-playing-card-symbols-pattern-blackjack-vector.jpg')]`}>

    <div className={`w-[900px] h-[620px] bg-[url('https://static.vecteezy.com/system/resources/previews/024/232/274/non_2x/green-casino-poker-table-texture-game-background-free-vector.jpg')] bg-auto  rounded-xl`}>
        
        <div className='flex flex-row w-full border-0 h-[330px]'>
            <div className='w-2/3 border-0 justify-top items-center flex flex-col'>
                <div className='flex-col flex gap-2 mt-2'>
                    <h2 className={`${stardos.className} text-center text-white`}>Dealer</h2>
                    {dealerHand.length ? (
                        <Hand cards={dealerHand} />
                    ) : (
                        <div className='flex gap-2'>
                            <Image src={'/images/facedowncard.png'} width={70} height={80} alt='' />
                            <Image src={'/images/facedowncard.png'} width={70} height={80} alt='' className='rounded-sm bg-none' />
                        </div>
                    )}
                </div>
                
                <div className='gap-2 flex flex-col mt-2'>
                    <h2 className={`${stardos.className} text-center text-white`}>Player</h2>
                    {playerHand.length ? (
                        <Hand cards={playerHand} />
                    ) : (
                        <div className='flex gap-2'>
                            <Image src={'/images/facedowncard.png'} width={70} height={80} alt='' />
                            <Image src={'/images/facedown.jpeg'} width={70} height={80} alt='' className='rounded-sm bg-none' />
                        </div>
                    )}
                </div>
                
            </div>
            <div className='w-1/3 mt-2 h-[320px] border-2 rounded-md mr-2 flex flex-col'>
                <div className='w-full p-2 text-white'>
                    <p className={`${stardos.className}`}>{playerMoney} mETH</p>
                </div>
                <div style={{backgroundColor: handleGetBackground()}} className={`${animationTimeout && 'animate-bounce'} w-full border-y-2 text-center p-2`}>
                    <p>{gameOutcome || 'Awaiting Game Outcome'}</p>
                </div>
                <div className='w-full px-0 border-b-2 flex text-white'>
                    <p className='w-[190px] ml-2'>Game History</p>
                    <p>Bet</p>
                    <p className='ml-2'>Payout</p>
                </div>
                <div className='flex flex-col overflow-scroll no-scrollbar'>
                    {history.map((item : GameHistoryItem, index: number) => (
                        <div style={{backgroundColor: handleHistoryGetBackground(item.outcome)}} key={index} className={`flex text-white justify-between  px-2 border-b-2`}>
                            <p className='w-2/3'>{item.outcome}</p>
                            <p className='w-1/6'>{item.bet}</p>
                            <p className='w-1/6'>{item.payout}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* betting */}

        <div className='w-2/3 items-center flex flex-col'>
            <div className='w-full flex flex-row items-center border-0 justify-center gap-8'>
                <div onClick={() => { gameState == 'playing' && computeWinner()}} className='bg-[white] cursor-pointer rounded-sm text-center'>
                <a href="#_" className="w-[500px] relative px-5 py-2 font-medium text-white group">
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-blue-500 group-hover:bg-blue-700 group-hover:skew-x-12"></span>
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-blue-700 group-hover:bg-blue-500 group-hover:-skew-x-12"></span>
                    <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-blue-600 -rotate-12"></span>
                    <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-blue-400 -rotate-12"></span>
                    <span className="relative">Stand</span>
                </a>
                </div>
                <div onClick={() => {gameState == 'playing' &&  hitPlayer()}} className='bg-[white] cursor-pointer rounded-sm text-center'>
                <a href="#_" className="w-[500px] relative px-5 py-2 font-medium text-white group">
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-blue-500 group-hover:bg-blue-700 group-hover:skew-x-12"></span>
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-blue-700 group-hover:bg-blue-500 group-hover:-skew-x-12"></span>
                    <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-blue-600 -rotate-12"></span>
                    <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-blue-400 -rotate-12"></span>
                    <span className="relative">Hit</span>
                </a>

                </div>
            </div>

            {/* chips */}
            <div className='w-full border-0 p-4 flex flex-row gap-8 justify-center '>
                <div onClick={() => gameState == 'betting' && setBet(10)} className={`cursor-pointer border-${bet == 10 ? '2' : '0'} h-[90px] w-12 items-center flex flex-col justify-center text-center rounded-md`}>
                    <Image src={'/images/red-chip.png'} width={40} alt='' height={30} />
                    <p className='text-white'>10</p>
                </div>
                <div onClick={() => gameState == 'betting' && setBet(25)} className={`cursor-pointer border-${bet == 25 ? '2' : '0'} h-[90px] w-12 items-center flex flex-col justify-center text-center rounded-md`}>
                    <Image src={'/images/green-chip.png'} width={40} alt='' height={30} />
                    <p className='text-white'>25</p>
                </div>
                <div onClick={() => gameState == 'betting' && setBet(50)} className={`cursor-pointer border-${bet == 50 ? '2' : '0'} h-[90px] w-12 items-center flex flex-col justify-center text-center rounded-md`}>
                    <Image src={'/images/blue-chip.png'} width={40} alt='' height={30} />
                    <p className='text-white'>50</p>
                </div>
                <div onClick={() => gameState == 'betting' && setBet(100)} className={`cursor-pointer border-${bet == 100 ? '2' : '0'} h-[90px] w-12 items-center flex flex-col justify-center text-center rounded-md`}>
                    <Image src={'/images/black-chip.png'} width={40} alt='' height={30} />
                    <p className='text-white'>100</p>
                </div>
            </div>

            <div className='p-2'>
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
            </div>
        </div>

    </div> 
    </div>   
</div>
  )
}

export default Game