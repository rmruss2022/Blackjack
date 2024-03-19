import { DeckAPIResponse, DrawnCard } from "./deckOfCardsTypes";


export enum Bets {
    Bet5 = 5,
    Bet10 = 10,
    Bet25 = 25,
    Bet100 = 100
}

// Define enums for possible outcomes
export enum GameOutcome {
    PlayerWin = "Player wins",
    DealerWin = "Dealer wins",
    PlayerBust = "Player busts",
    DealerBust = "Dealer busts",
    PlayerAndDealerBust = "Both players bust",
    Tie = "It's a tie",
    Undefined = "Undefined"
};


export interface GameHistoryItem {
    playerHand: DrawnCard[];
    dealerHand: DrawnCard[];
    outcome: GameOutcome;
    bet: number;
    payout: number;
    datetime: string;
}




// write  a type for the context
export type GameContextType = {
    gameState: string,
    setGameState: (value: string) => void,
    playerHand: DrawnCard[],
    setPlayerHand: (value: DrawnCard[]) => void,
    dealerHand: DrawnCard[],
    setDealerHand: (value: DrawnCard[]) => void,
    deck: DeckAPIResponse,
    setDeck: (value: DeckAPIResponse) => void,
    history: GameHistoryItem[],
    setHistory: (value: GameHistoryItem[]) => void,
    bet: number,
    setBet: (value: number) => void,
    playerMoney: number,
    setPlayerMoney: (value: number) => void,
    gameOutcome: GameOutcome,
    setGameOutcome: (value: GameOutcome) => void,
    animationTimeout: boolean,
    setAnimationTimeout: (value: boolean) => void,
    loading: boolean,
    setLoading: (value: boolean) => void,
    hitPlayer: () => void,
    dealCards: () => void,
    determinePayout: (outcome: GameOutcome, playerHand: DrawnCard[]) => number,
    computeWinner: (playerHand: DrawnCard[], dealerHand: DrawnCard[]) => void,
}