import {ICard} from "../skills-cards";
import {shuffle} from "../../utils/array-shuffler";
import {TBlockEffect} from "../effects";

import {IActorTrait} from "./trait";

export enum EActorType {
    Player = 'Player',
    Mob = 'Mob',
}

export interface IActor {
    name: string;
    maxHealth: number;
    health: number;
    deck: ICard[];
    hand: ICard[];
    preparedAction?: {
        card: ICard;
        target?: IActor;
    };
    blocks: Partial<Record<TBlockEffect, number>>;
    discards: ICard[];
    type: EActorType;
    traits: IActorTrait[];
}

export interface IDrawCardResult {
    actor: IActor;
    discardShuffled: boolean;
    cards: ICard[];
}

export function actorTakeCard(actor: IActor, num: number = 1): IDrawCardResult {
    const result: IDrawCardResult = {
        actor: actor,
        discardShuffled: false,
        cards: []
    };

    for (let i = 0; i < num; i++) {
        if (actor.type === EActorType.Mob && actor.hand.length > 0) {
            break; // Мобы не "держат" в руке больше одной карты
        }
        if (actor.deck.length === 0 && actor.discards.length > 0) {
            actor.deck = shuffle(actor.discards.slice());
            actor.discards = [];
            result.discardShuffled = true;
        }

        if (actor.deck.length) {
            result.cards.push(actor.deck.shift())
        }
    }

    actor.hand.push(...result.cards);

    return result;
}
