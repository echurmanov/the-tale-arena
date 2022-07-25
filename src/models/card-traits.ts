import {ICard} from "./skills-cards";

export enum ECardTraitType {
    FROZEN = 'FROZEN',
    HIDDEN = 'HIDDEN',
}

export interface ICardTrait {
    trait: ECardTraitType;
    turnsLeft?: number;
}

export function equalsTraits(t1: ICardTrait, t2: ICardTrait): boolean {
    return t1.trait === t2.trait;
}

export function addCardTrait(card: ICard, trait: ICardTrait) {
    const oldTrait = card.traits.find(t => equalsTraits(t, trait));

    if (oldTrait) {
        if (oldTrait.turnsLeft && oldTrait.turnsLeft < trait.turnsLeft) {
            oldTrait.turnsLeft = trait.turnsLeft;
        }
    } else {
        card.traits.push(trait);
    }
}

export function hasTrait(card: ICard, traitType: ECardTraitType) {
    return card.traits.some(t => t.trait === traitType);
}


