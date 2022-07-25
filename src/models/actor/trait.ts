import {EEffectType} from "../effects";
import {IActor} from "./actor";

export enum EActorTraitType {
    TURN_BEGIN_EFFECT = 'TURN_BEGIN_EFFECT',
    AFTER_CARD_SELECT_EFFECT = 'AFTER_CARD_SELECT_EFFECT',
    PREDICTABLE = 'PREDICTABLE',
    UNDESTRUCTABLE = 'UNDESTRUCTABLE',
    BLIND = 'BLIND',
    CONFUSED = 'CONFUSED',
    NO_DAMAGE_PRODUCE = 'NO_DAMAGE_PRODUCE',
}

export interface IActorTrait {
    trait: EActorTraitType;
    turnsLeft: number;
    power?: number;
    isUnique?: true;
    isStack?: true;
}

export interface IActorEffectTrait extends IActorTrait{
    trait: EActorTraitType.TURN_BEGIN_EFFECT | EActorTraitType.AFTER_CARD_SELECT_EFFECT;
    effect: EEffectType;
    power?: number;
}

export function isEffectTrait(trait: IActorTrait): trait is IActorEffectTrait {
    return [
        EActorTraitType.TURN_BEGIN_EFFECT,
        EActorTraitType.AFTER_CARD_SELECT_EFFECT,
    ].includes(trait.trait);
}

export function equalsTraits(t1: IActorTrait, t2: IActorTrait): boolean {
    return t1.trait === t2.trait &&
        (!isEffectTrait(t1) || !isEffectTrait(t2) || t1.effect === t2.effect);
}

export function addTrait(actor: IActor, trait: IActorTrait) {
    if (trait.isUnique) {
        const oldTraitIndex = actor.traits.findIndex(t => equalsTraits(t, trait));

        if (trait.isStack && isEffectTrait(trait)) {
            actor.traits[oldTraitIndex].power += trait.power;
        } else {
            actor.traits[oldTraitIndex] = trait;

        }
    } else {
        actor.traits.push(trait);
    }
}

export function hasTrait(actor: IActor, traitType: EActorTraitType) {
    return actor.traits.some(t => t.trait === traitType);
}


