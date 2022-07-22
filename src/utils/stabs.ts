import {EActorType, IActor, ISide} from "../models/battle";
import {IEffect} from "../models/effects";
import {ESkills, ICard} from "../models/skills-cards";

export function createActor(name: string): IActor {
    return {
        type: EActorType.Player,
        name: name || 'Персонаж',
        maxHealth: 10,
        health: 10,
        hand: [],
        discards: [],
        deck: [],
        blocks: {}
    };
}

export function createSideStub(actorsNumber: number = 1, namePrefix = ''): ISide {
    const actors: IActor[] = [];

    for(let i = 0; i < actorsNumber; i++) {
        actors.push(createActor(`${namePrefix} ${i}`));
    }

    return {
        actors,
    }
}

export function createCard(effects: IEffect[], name = 'Карта'): ICard {
    return {
        name: name,
        skill: ESkills.PHYSIC_COMBAT,
        skillLevel: 0,
        effects
    }
}
