// services/deckOfCardsAPI.ts

import { DeckAPIResponse, CardPullResponse } from './types/deckOfCardsTypes';

export class DeckOfCardsService {
    
    static async getShuffledDeck(): Promise<DeckAPIResponse> {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        return await response.json();
    }

    static async reshuffleDeck(deckId: string): Promise<DeckAPIResponse> {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle`);
        return await response.json();
    }

    static async drawCards(deckId: string, count: number): Promise<CardPullResponse> {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
        return await response.json();
    }
}