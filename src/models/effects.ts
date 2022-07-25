import {shuffle} from "../utils/array-shuffler";

import {
    isBlockingType,
    isCloseCombatEffect,
    isDirectCombatEffect,
    isPhysicalCombatDamageEffect,
    isRangeCombatEffect
} from "./utils";
import {actorTakeCard, EActorType, IActor} from "./actor/actor";
import {addTrait, EActorTraitType, IActorEffectTrait} from "./actor/trait";
import {ICard} from "./skills-cards";
import {addCardTrait, ECardTraitType} from "./card-traits";
import {ISide} from "./battle";

export enum EEffectType {
    PHYSIC_CLOSE_DAMAGE = 'PHYSIC_CLOSE_DAMAGE',                //done,tested
    MAGIC_CLOSE_DAMAGE = 'MAGIC_CLOSE_DAMAGE',                  //done,tested

    PHYSIC_RANGE_DAMAGE = 'PHYSIC_RANGE_DAMAGE',                //done,tested
    MAGIC_RANGE_DAMAGE = 'MAGIC_RANGE_DAMAGE',                  //done,tested

    PHYSIC_DIRECT_DAMAGE = 'PHYSIC_DIRECT_DAMAGE',              //done,tested
    MAGIC_DIRECT_DAMAGE = 'MAGIC_DIRECT_DAMAGE',                //done,tested

    PHYSIC_PERIODIC_DAMAGE = 'PHYSIC_PERIODIC_DAMAGE',          //done,tested
    MAGIC_PERIODIC_DAMAGE = 'MAGIC_PERIODIC_DAMAGE',            //done,tested

    PHYSIC_INDIVIDUAL_BLOCK = 'PHYSIC_INDIVIDUAL_BLOCK',        //done,tested
    MAGIC_INDIVIDUAL_BLOCK = 'MAGIC_INDIVIDUAL_BLOCK',          //done,tested
    UNIVERSAL_INDIVIDUAL_BLOCK = 'UNIVERSAL_INDIVIDUAL_BLOCK',  //done,tested

    PHYSIC_COVER_BLOCK = 'PHYSIC_COVER_BLOCK',                  //done,tested
    MAGIC_COVER_BLOCK = 'MAGIC_COVER_BLOCK',                    //done,tested
    UNIVERSAL_COVER_BLOCK = 'UNIVERSAL_COVER_BLOCK',            //done,tested

    GAIN_HEALTH = 'GAIN_HEALTH',                                //done,tested
    SET_HEALTH = 'SET_HEALTH',                                  //done,tested

    ADD_CARD_TO_DECK = 'ADD_CARD_TO_DECK',                      //done,tested
    DISCARD = 'DISCARD',                                        //done
    DRAW_CARD = 'DRAW_CARD',                                    //done
    CYCLING_CARD = 'CYCLING_CARD',                              //done
    STEAL_CARD = 'STEAL_CARD',                                  //Убрать?

    FROZEN = 'FROZEN',                                          //done
    BLIND = 'BLIND',                                            //done
    CONFUSE = 'CONFUSE',                                        //done

    PHYSIC_ADVANTAGE = 'PHYSIC_ADVANTAGE',                      //done
    MAGIC_ADVANTAGE = 'MAGIC_ADVANTAGE',                        //done

    CARD_GAIN_EFFECT = 'CARD_GAIN_EFFECT',                      //убрать?
    CHANGE_CARD = 'CHANGE_CARD',                                //убрать?

    NO_DAMAGE_PROCEDURE = 'NO_DAMAGE_PROCEDURE',                //done
}

export type TBlockEffect = EEffectType.PHYSIC_INDIVIDUAL_BLOCK
    | EEffectType.MAGIC_INDIVIDUAL_BLOCK
    | EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK
    | EEffectType.PHYSIC_COVER_BLOCK
    | EEffectType.MAGIC_COVER_BLOCK
    | EEffectType.UNIVERSAL_COVER_BLOCK;

export interface IEffect {
    type: EEffectType;
    power?: number;
    extraOptions?: any;
    isFlash?: boolean;
    isSuccessEffects?: ISubEffect[];
    perSuccessEffects?: ISubEffect[];
    isUnblockable?: boolean;
}

export interface ISubEffect extends IEffect {
    target: 'same' | 'source' | 'right' | 'left';
}

export interface IActiveEffect {
    source: IActor;
    target?: IActor;
    effects: (IEffect | ISubEffect)[];
}

export interface IEffectResults {
    source: IActor;
    target?: IActor;
    effect?: EEffectType;
    power?: number;
    extra?: object;
    result?: string;
    message?: string;
}


export function applyEffects(attackers: ISide, defenders: ISide, effects: IActiveEffect[]): IEffectResults[] {
    const log:IEffectResults[] = [];

    effects.forEach(({source, target, effects}) => {
        effects.forEach(effect => {
            let actualSource = source;
            let actualTarget = target || source;

            if (isSubEffect(effect)) {
                if (effect.target === "source") {
                    actualTarget = actualSource;
                } else {
                    let list;
                    if (attackers.actors.includes(actualTarget)) {
                        list = attackers.actors;
                    } else {
                        list = defenders.actors;
                    }

                    switch (effect.target) {
                        case "left":
                            actualTarget = list[list.indexOf(actualTarget) - 1] || null;
                            break;
                        case "right":
                            actualTarget = list[list.indexOf(actualTarget) + 1] || null;
                            break
                    }
                }
            }

            if (!actualTarget) {
                return log;
            }

            switch (effect.type) {
                case EEffectType.PHYSIC_INDIVIDUAL_BLOCK:
                case EEffectType.PHYSIC_COVER_BLOCK:
                case EEffectType.MAGIC_INDIVIDUAL_BLOCK:
                case EEffectType.MAGIC_COVER_BLOCK:
                case EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK:
                case EEffectType.UNIVERSAL_COVER_BLOCK: {
                    const actor = actualTarget || actualSource;

                    if (!actor.blocks) {
                        actor.blocks = {};
                    }

                    actor.blocks[effect.type] = actor.blocks[effect.type] ? actor.blocks[effect.type] + effect.power : effect.power;

                    break;
                }
                case EEffectType.PHYSIC_RANGE_DAMAGE:
                case EEffectType.PHYSIC_CLOSE_DAMAGE:
                case EEffectType.PHYSIC_DIRECT_DAMAGE:
                case EEffectType.MAGIC_RANGE_DAMAGE:
                case EEffectType.MAGIC_CLOSE_DAMAGE:
                case EEffectType.MAGIC_DIRECT_DAMAGE:
                    log.push(...damageEffectProcessor(attackers, defenders, actualSource, actualTarget, effect));
                    break;
                case EEffectType.PHYSIC_ADVANTAGE:
                case EEffectType.MAGIC_ADVANTAGE:
                    {
                        const actor = actualTarget || actualSource;

                        addTrait(actor, {
                            trait: EActorTraitType.AFTER_CARD_SELECT_EFFECT,
                            effect: effect.type,
                            power: effect.power,
                            isStack: true,
                            isUnique: true
                        } as IActorEffectTrait);

                        log.push({source: actualSource, target: actualTarget, effect: effect.type, power: effect.power});
                    }
                    break;
                case EEffectType.GAIN_HEALTH:
                    {
                        const power = Math.min(effect.power, actualTarget.maxHealth - actualTarget.health);


                        if (power > 0) {
                            actualTarget.health += power;
                            log.push({
                                source: actualSource,
                                target: actualTarget,
                                effect: EEffectType.GAIN_HEALTH,
                                power: power
                            });
                        }
                    }
                    break;
                case EEffectType.SET_HEALTH:
                    actualTarget.health = Math.min(effect.power, actualTarget.maxHealth);

                    log.push({
                        source: actualSource,
                        target: actualTarget,
                        effect: EEffectType.SET_HEALTH,
                        power: actualTarget.health
                    });
                    break;
                case EEffectType.ADD_CARD_TO_DECK:
                    const card: ICard = effect.extraOptions as ICard;

                    actualTarget.deck = shuffle([...actualTarget.deck, card]);

                    log.push({
                        source: actualSource,
                        target: actualTarget,
                        effect: EEffectType.ADD_CARD_TO_DECK,
                        extra: {
                            shuffle: true,
                            card
                        }
                    });
                    break;
                case EEffectType.DISCARD: {
                    log.push(...discardCardEffectProcessor(actualSource, actualTarget, effect.power || 1));

                    break;
                }
                case EEffectType.CYCLING_CARD:
                    const discards = discardCardEffectProcessor(actualSource, actualTarget, effect.power || 1);
                    log.push(...discards);
                    if (discards.length > 0 && actualTarget.type === EActorType.Player) {
                        const takeResult = actorTakeCard(actualTarget, discards.length);

                        log.push({
                            source: actualSource,
                            target: actualTarget,
                            effect: EEffectType.DRAW_CARD,
                            power: takeResult.cards.length,
                            extra: {
                                shuffle: takeResult.discardShuffled,
                            }
                        });
                    }
                    break;
                case EEffectType.DRAW_CARD:
                    if (actualTarget.type === EActorType.Player) {
                        const takeResult = actorTakeCard(actualTarget, effect.power);

                        log.push({
                            source: actualSource,
                            target: actualTarget,
                            effect: EEffectType.DRAW_CARD,
                            power: takeResult.cards.length,
                            extra: {
                                shuffle: takeResult.discardShuffled,
                            }
                        });
                    }
                    break;
                case EEffectType.FROZEN:
                    const frozenTurns = actualTarget.type === EActorType.Mob ? 1 : 2;
                    actualTarget.hand.forEach(card => addCardTrait(card, {trait: ECardTraitType.FROZEN, turnsLeft: frozenTurns}));

                    log.push({
                        source: actualSource,
                        target: actualTarget,
                        effect: EEffectType.FROZEN,
                        extra: {
                            cards: actualTarget.hand.slice(),
                        }
                    })
                    break;

                case EEffectType.BLIND: {
                    if (actualTarget.type === EActorType.Player) {
                        const turnsLeft = effect.power || 1;
                        addTrait(actualTarget, {trait: EActorTraitType.BLIND, turnsLeft});
                        log.push({
                            source: actualSource,
                            target: actualTarget,
                            effect: EEffectType.BLIND,
                            power: turnsLeft
                        });
                    }
                    break;
                }

                case EEffectType.CONFUSE: {
                    const trait = actualTarget.type === EActorType.Mob ? EActorTraitType.PREDICTABLE : EActorTraitType.CONFUSED
                    const turnsLeft = effect.power || 1;
                    addTrait(actualTarget, {trait: trait, turnsLeft});
                    log.push({
                        source: actualSource,
                        target: actualTarget,
                        effect: EEffectType.CONFUSE,
                        power: turnsLeft
                    });
                    break;
                }

                case EEffectType.NO_DAMAGE_PROCEDURE: {
                    addTrait(actualTarget, {trait: EActorTraitType.NO_DAMAGE_PRODUCE, turnsLeft: 1});
                    log.push({
                        source: actualSource,
                        target: actualTarget,
                        effect: EEffectType.NO_DAMAGE_PROCEDURE,
                        power: 1
                    });
                    break;
                }
            }
        })
    });

    return log;
}

function discardCardEffectProcessor(source: IActor, target: IActor, number = 1): IEffectResults[] {
    const log: IEffectResults[] = [];

    for (let i = 0; i < number; i++) {
        let card = null;
        if (target.type === EActorType.Mob) {
            if (target.deck.length > 0) {
                card = target.deck.shift();
            }
        } else if (target.hand.length > 0) {
            card = target.hand[Math.floor(Math.random() * target.hand.length)];
        }

        if (card) {
            target.discards.push(card);

            if (target.deck.length === 0) {
                target.deck = shuffle(target.discards.slice());
                target.discards = [];
            }

            log.push({
                source: source,
                target: target,
                effect: EEffectType.DISCARD,
                extra: {
                    card,
                    shuffle: target.discards.length === 0,
                }
            });
        }
    }

    return log;
}

function damageEffectProcessor(attackers: ISide, defenders: ISide, source: IActor, target: IActor, effect:IEffect | ISubEffect): IEffectResults[] {
    const distanceToTarget = attackers.actors.indexOf(source) + defenders.actors.indexOf(target) + 1;
    const blocksBeforeTarget = defenders.actors.slice(0, defenders.actors.indexOf(target) + 1).map(actor => actor.blocks);

    const log: IEffectResults[] = [];

    if ((isCloseCombatEffect(effect.type) && distanceToTarget > 2)
        || (isRangeCombatEffect(effect.type) && distanceToTarget > 4)
    ) {
        log.push({source, target, result: 'error', message: "Target over distance"});
        return log;
    }

    let successPower = effect.power;
    let blockPower: Partial<Record<TBlockEffect, number>>[] = [];

    if (!effect.isUnblockable) {
        blocksBeforeTarget.forEach((blocks, idx) => {
            if (successPower === 0) {
                return;
            }

            blockPower[idx] = {};

            const blockTypes: TBlockEffect[] = [];

            if (idx === blocksBeforeTarget.length - 1) {
                blockTypes.push(
                    isPhysicalCombatDamageEffect(effect.type) ? EEffectType.PHYSIC_INDIVIDUAL_BLOCK : EEffectType.MAGIC_INDIVIDUAL_BLOCK,
                    EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK
                );
            }

            if (!isDirectCombatEffect(effect.type) || idx === blocksBeforeTarget.length - 1) {
                blockTypes.push(
                    isPhysicalCombatDamageEffect(effect.type) ? EEffectType.PHYSIC_COVER_BLOCK : EEffectType.MAGIC_COVER_BLOCK,
                    EEffectType.UNIVERSAL_COVER_BLOCK
                );
            }

            blockTypes.forEach((blockType) => {
                if (successPower === 0) {
                    return;
                }

                const blockedNumber = Math.min(successPower, blocks[blockType] || 0);

                if (blockedNumber) {
                    successPower -= blockedNumber;
                    blocks[blockType] -= blockedNumber;
                    log.push({source, target: defenders.actors[idx], effect: blockType, power: blockedNumber});
                    blockPower[idx][blockType] = blockedNumber;
                }
            });
        })
    }

    if (successPower > 0) {
        target.health -= successPower
        log.push({source, target, effect: effect.type, power: successPower})

        if (effect.isSuccessEffects && effect.isSuccessEffects.length > 0) {
            log.push(...applyEffects(
                attackers,
                defenders,
                [{source, target, effects: effect.isSuccessEffects}]
            ));
        }

        if (effect.perSuccessEffects && effect.perSuccessEffects.length > 0) {
            effect.perSuccessEffects.forEach(effect => {
                log.push(...applyEffects(
                    attackers,
                    defenders,
                    [{source, target, effects: [Object.assign({}, effect, {power: successPower})]}]
                ));
            });
        }
    }

    blockPower.forEach((power, idx) => {
        if (!power || !defenders.actors[idx].preparedAction) return;

        const blockerAction = defenders.actors[idx].preparedAction;

        blockerAction.card.effects.forEach((effect: IEffect) => {
            if (isBlockingType(effect.type)) {
                const blockPower = power[effect.type];
                if (effect.isSuccessEffects && effect.isSuccessEffects.length > 0 && blockPower) {
                    log.push(...applyEffects(defenders, attackers, [{
                        source: defenders.actors[idx],
                        target: source,
                        effects: effect.isSuccessEffects
                    }]))
                }

                if (effect.perSuccessEffects && effect.perSuccessEffects.length > 0 && blockPower) {
                    effect.perSuccessEffects.forEach(effect => {
                        log.push(...applyEffects(
                            defenders,
                            attackers,
                            [{
                                source: defenders.actors[idx],
                                target: source,
                                effects: [Object.assign({}, effect, {power: blockPower})]
                            }]
                        ));
                    });
                }
            }
        })
    })

    return log;
}

export function isSubEffect(effect: IEffect | ISubEffect): effect is ISubEffect {
    return 'target' in effect;
}