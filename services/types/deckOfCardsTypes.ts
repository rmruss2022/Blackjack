// services/types/deckOfCardsTypes.ts

export interface DeckAPIResponse {
    success: boolean;
    deck_id: string;
    shuffled: boolean;
    remaining: number;
}

export interface CardPullResponse {
    success: boolean;
    deck_id: string;
    cards: DrawnCard[];
    remaining: number;
}

export interface DrawnCard {
    code: string;
    image: string;
    images: {
        svg: string;
        png: string;
    };
    value: string;
    suit: string;
}



export const blackjackHand: DrawnCard[] = [
    {
        code: 'AS',
        image: 'https://deckofcardsapi.com/static/img/AS.png',
        images: {
            svg: 'https://deckofcardsapi.com/static/img/AS.png',
            png: 'https://deckofcardsapi.com/static/img/AS.png'
        },
        value: 'ACE',
        suit: 'SPADES'
    },
    {
        code: 'KD',
        image: 'https://deckofcardsapi.com/static/img/KD.png',
        images: {
            svg: 'https://deckofcardsapi.com/static/img/KD.png',
            png: 'https://deckofcardsapi.com/static/img/KD.png'
        },
        value: 'KING',
        suit: 'DIAMONDS'
    }];