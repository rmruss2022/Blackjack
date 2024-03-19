// services/gameService.ts

import { DeckOfCardsService } from './deckOfCardsAPIService';
import { DeckAPIResponse, DrawnCard } from './types/deckOfCardsTypes';
import { GameOutcome } from './types/gameTypes';



class GameService {
    // Map card values
    static readonly cardValues: { [card: string]: number } = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
        '8': 8, '9': 9, '10': 10, 'JACK': 10, 'QUEEN': 10,
        'KING': 10, 'ACE': 1 // Treat ACE initially as 1
    };

    static isBlackjack(hand: DrawnCard[]): boolean {
        if (hand.length !== 2) {
            return false;
        }
        const values = hand.map(card => this.cardValues[card.value]);
        return values.includes(1) && values.includes(10);
    }

    
    static computeHandSum(playerHand: DrawnCard[]): number {

        let sum = 0;    
        let aceCount = 0;
    
        // Calculate initial sum and count Aces
        for (const card of playerHand) {
            sum += this.cardValues[card.value]; // Fixed reference to cardValues
            if (card.value === 'ACE') {
                aceCount++;
            }
        }
    
        // Adjust for Aces being 11, if it does not cause bust
        while (aceCount > 0 && sum + 10 <= 21) {
            sum += 10; // Adding 10 instead of 11 because 1 was already added for ACE
            aceCount--;
        }
    
        return sum;
    }

    static determineWinner(player: DrawnCard[], dealer: DrawnCard[]): GameOutcome {
        
        const playerSum = this.computeHandSum(player);
        const dealerSum = this.computeHandSum(dealer);
        const playerHasBlackjack = this.isBlackjack(player);
        const dealerHasBlackjack = this.isBlackjack(dealer);


        if (playerHasBlackjack && dealerHasBlackjack) {
            return GameOutcome.Tie;
        } else if (playerHasBlackjack) {
            return GameOutcome.PlayerWin;
        } else if (dealerHasBlackjack) {
            return GameOutcome.DealerWin;
        } else if (playerSum > 21 && dealerSum > 21) {
            return GameOutcome.PlayerAndDealerBust;
        } else if (playerSum > 21) {
            return GameOutcome.PlayerBust
        } else if (dealerSum > 21) {
            return GameOutcome.DealerBust;
        } else if (playerSum > dealerSum) {
            return GameOutcome.PlayerWin;
        } else if (dealerSum > playerSum) {
            return GameOutcome.DealerWin;
        } else {
            return GameOutcome.Tie;
        }
    }

    // Define a function to map GameOutcome to colors
    static mapGameOutcomeToColor(outcome: GameOutcome): string {
        switch (outcome) {
            case GameOutcome.PlayerWin:
                return '#05783e';
            case GameOutcome.DealerWin:
                return '#a11a10';
            case GameOutcome.PlayerBust:
                return '#a11a10';
            case GameOutcome.DealerBust:
                return '#05783e';
            case GameOutcome.PlayerAndDealerBust:
                return '#474747';
            case GameOutcome.Tie:
                return '#474747';
            default:
                return '#474747'; // Default color
        }
    }

    static async shuffleDeck(deckId: string): Promise<DeckAPIResponse | null> {
        // Shuffle is required
        const newDeckResponse: DeckAPIResponse = await DeckOfCardsService.reshuffleDeck(deckId); // Assuming this method exists and fetches a new shuffled deck
        if (newDeckResponse.success) {
            return newDeckResponse;
        }
        console.error('Failed to fetch new deck.');
        return null;
    }
}

export default GameService;