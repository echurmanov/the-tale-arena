import {
    isBlockingEffect, isBlockingType,
    isCloseCombatEffect,
    isDirectCombatEffect,
    isPhysicalCombatDamageEffect,
    isRangeCombatEffect
} from "./utils";
import {IActor, ISide, TBlockEffect} from "./battle";

export enum EEffectType {
    PHYSIC_CLOSE_DAMAGE = 'PHYSIC_CLOSE_DAMAGE',
    MAGIC_CLOSE_DAMAGE = 'MAGIC_CLOSE_DAMAGE',

    PHYSIC_RANGE_DAMAGE = 'PHYSIC_RANGE_DAMAGE',
    MAGIC_RANGE_DAMAGE = 'MAGIC_RANGE_DAMAGE',

    PHYSIC_DIRECT_DAMAGE = 'PHYSIC_DIRECT_DAMAGE',
    MAGIC_DIRECT_DAMAGE = 'MAGIC_DIRECT_DAMAGE',

    PHYSIC_PERIODIC_DAMAGE = 'PHYSIC_PERIODIC_DAMAGE',
    MAGIC_PERIODIC_DAMAGE = 'MAGIC_PERIODIC_DAMAGE',

    PHYSIC_INDIVIDUAL_BLOCK = 'PHYSIC_INDIVIDUAL_BLOCK',
    MAGIC_INDIVIDUAL_BLOCK = 'MAGIC_INDIVIDUAL_BLOCK',
    UNIVERSAL_INDIVIDUAL_BLOCK = 'UNIVERSAL_INDIVIDUAL_BLOCK',

    PHYSIC_COVER_BLOCK = 'PHYSIC_COVER_BLOCK',
    MAGIC_COVER_BLOCK = 'MAGIC_COVER_BLOCK',
    UNIVERSAL_COVER_BLOCK = 'UNIVERSAL_COVER_BLOCK',

    GAIN_HEALTH = 'GAIN_HEALTH',
    SET_HEALTH = 'SET_HEALTH',
    HEAL_TARGET = 'HEAL_TARGET',

    DISCARD = 'DISCARD',
    DRAW = 'DRAW',
    CYCLING = 'CYCLING',
    STEAL_CARD = 'STEAL_CARD',

    FROZEN = 'FROZEN',
    BLIND = 'BLIND',
    CONFUSE = 'CONFUSE',

    PHYSIC_ADVANTAGE = 'PHYSIC_ADVANTAGE',
    MAGIC_ADVANTAGE = 'MAGIC_ADVANTAGE',

    CARD_GAIN_EFFECT = 'CARD_GAIN_EFFECT',
    CHANGE_CARD = 'CHANGE_CARD',

    NO_DAMAGE_PROCEDURE = 'NO_DAMAGE_PROCEDURE',
}

export interface IEffect {
    type: EEffectType;
    power: number;
    isFlash?: boolean;
    isSuccessEffects?: ISubEffect[];
    perSuccessEffects?: ISubEffect[];
    isUnblockable?: boolean;
}

export interface ISubEffect {
    target: 'same' | 'source' | 'right' | 'left';
    type: EEffectType;
    power?: number;
    isUnblockable?: boolean;
    isSuccessEffects?: ISubEffect[];
    perSuccessEffects?: ISubEffect[];
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
                switch (effect.target) {
                    case 'source':
                        actualTarget = actualSource;
                        break;
                    case 'left':
                        actualTarget = defenders.actors[defenders.actors.indexOf(actualTarget) - 1] ||
                            attackers.actors[defenders.actors.indexOf(actualTarget) - 1] || null;
                        break;
                    case 'right':
                        actualTarget = defenders.actors[defenders.actors.indexOf(actualTarget) + 1] ||
                            attackers.actors[defenders.actors.indexOf(actualTarget) + 1] || null;
                        break;
                }
            }

            if (!actualTarget) {
                return log;
            }

            switch (effect.type) {
                case EEffectType.PHYSIC_RANGE_DAMAGE:
                case EEffectType.PHYSIC_CLOSE_DAMAGE:
                case EEffectType.PHYSIC_DIRECT_DAMAGE:
                case EEffectType.MAGIC_RANGE_DAMAGE:
                case EEffectType.MAGIC_CLOSE_DAMAGE:
                case EEffectType.MAGIC_DIRECT_DAMAGE:
                    log.push(...damageEffectProcessor(attackers, defenders, actualSource, actualTarget, effect));
                    break;
                case EEffectType.GAIN_HEALTH:
                    actualTarget.health = Math.min(actualTarget.health + effect.power, actualTarget.maxHealth);

                    log.push({source: actualSource, target: actualTarget, effect: EEffectType.SET_HEALTH, power:  actualTarget.health});
                    break;
            }
        })
    });

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