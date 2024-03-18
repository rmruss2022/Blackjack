import { DrawnCard } from "./deckOfCardsTypes";


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
    Tie = "It's a tie"
};


export interface GameHistoryItem {
    playerHand: DrawnCard[];
    dealerHand: DrawnCard[];
    outcome: GameOutcome;
    bet: number;
    payout: number;
    datetime: string;
}


