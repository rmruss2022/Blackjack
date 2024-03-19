import React, { useContext } from 'react'
import { Bonbon , Miltonian} from 'next/font/google'
import { useGame } from './GameContext'
import { DrawnCard } from '../../services/types/deckOfCardsTypes';
import Image from 'next/image'

const miltonian = Miltonian({
    weight: '400',
    subsets: ['latin'],
  })

export const Hand = ({ cards }: {cards: DrawnCard[]}) => {
    return (
      <div className='flex gap-2'>
        {cards.map((card: DrawnCard, index: number) => (
          <Image key={index} src={card.image || ''} alt='' width={70} height={80}  />
        ))}
      </div>
    );
  };
  
const PlayerHand = () => {

    const {playerHand} = useGame();

    console.log('playerHand: ', playerHand)

  return (
    <div className='gap-2 flex flex-col mt-2'>
        <h2 className={`${miltonian.className} text-center text-white`}>Player</h2>
        {playerHand.length ? (
            <Hand cards={playerHand} />
        ) : (
            <div className='flex gap-2'>
                <Image src={'/images/facedowncard.png'} width={70} height={80} alt='' />
                <Image src={'/images/facedown.jpeg'} width={70} height={80} alt='' className='rounded-sm bg-none' />
            </div>
        )}
    </div>
  )
}

const DealerHand = () => {

    const {dealerHand} = useGame();


  return (
    <div className='flex-col flex gap-2 mt-2'>
        <h2 className={`${miltonian.className} text-center text-white`}>Dealer</h2>
        {dealerHand.length ? (
            <Hand cards={dealerHand} />
        ) : (
            <div className='flex gap-2'>
                <Image src={'/images/facedowncard.png'} width={70} height={80} alt='' />
                <Image src={'/images/facedowncard.png'} width={70} height={80} alt='' className='rounded-sm bg-none' />
            </div>
        )}
    </div>
  )
                    }

export  {PlayerHand, DealerHand};