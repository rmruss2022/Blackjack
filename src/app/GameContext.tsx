
import { createContext, useContext, useEffect, useState } from "react";
import { DeckOfCardsService } from "../../services/deckOfCardsAPIService";
import GameService from "../../services/gameService";
import { GameContextType, GameHistoryItem, GameOutcome } from "../../services/types/gameTypes";
import { DeckAPIResponse, DrawnCard } from "../../services/types/deckOfCardsTypes";

const GameContext = createContext<GameContextType>({} as GameContextType);



export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }: any) => {
    const [gameState, setGameState] = useState<string>('betting'); // ['betting', 'playing', 'gameover'
    const [playerHand, setPlayerHand] = useState<DrawnCard[]>([]);
    const [dealerHand, setDealerHand] = useState<DrawnCard[]>([]);
    const [deck, setDeck] = useState<DeckAPIResponse>({success: true, deck_id: '', remaining: 0, shuffled: false}); // Placeholder cards
    const [history, setHistory] = useState<GameHistoryItem[]>([]); 
    const [bet, setBet] = useState<number>(10); 
    const [playerMoney, setPlayerMoney] = useState<number>(1000); 
    const [gameOutcome, setGameOutcome] = useState<GameOutcome>(GameOutcome.Undefined);
    const [animationTimeout, setAnimationTimeout] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);


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

    const determinePayout = (outcome: GameOutcome, playerHand: DrawnCard[]): number => {
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
            const payout = determinePayout(gameOutcome, updatedPlayerHand);
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


    const computeWinner = (playerHand: DrawnCard[], dealerHand: DrawnCard[]) => {
        const gameOutcome = GameService.determineWinner(playerHand, dealerHand);
        setGameOutcome(gameOutcome);
        setAnimationTimeout(true);
        setTimeout(() => setAnimationTimeout(false), 3000);
        const payout = determinePayout(gameOutcome, playerHand);
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
        if (playerDrawResponse && dealerDrawResponse.success) {
            setPlayerHand(playerDrawResponse.cards);
            setDealerHand(dealerDrawResponse.cards);
        } else {
            console.error('Failed to draw cards.');
        }
        
        // check for blackjack
        const playerSum = GameService.computeHandSum(playerDrawResponse.cards);
        const dealerSum = GameService.computeHandSum(dealerDrawResponse.cards);

        console.log('playerSum: ', playerSum, 'dealerSum: ', dealerSum)

        if (playerSum === 21 || dealerSum === 21) {
            computeWinner(playerDrawResponse.cards, dealerDrawResponse.cards);
        }
    };


    return (
        <GameContext.Provider value={{
            gameState, setGameState,
            playerHand, setPlayerHand,
            dealerHand, setDealerHand,
            deck, setDeck,
            history, setHistory,
            bet, setBet,
            playerMoney, setPlayerMoney,
            gameOutcome, setGameOutcome,
            animationTimeout, setAnimationTimeout,
            loading, setLoading,
            // Add all the functions here
            hitPlayer,
            dealCards,
            determinePayout,
            computeWinner

        }}>
            {children}
        </GameContext.Provider>
    );
};
