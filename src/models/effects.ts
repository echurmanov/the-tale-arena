import {isCloseCombatEffect, isRangeCombatEffect} from "./utils";
import {IActor, ISide} from "./battle";

export enum EEffectType {
    PHYSICAL_CLOSE_DAMAGE = 'PHYSICAL_CLOSE_DAMAGE',
    MAGIC_CLOSE_DAMAGE = 'MAGIC_CLOSE_DAMAGE',

    PHYSICAL_RANGE_DAMAGE = 'PHYSICAL_RANGE_DAMAGE',
    MAGIC_RANGE_DAMAGE = 'MAGIC_RANGE_DAMAGE',

    PHYSICAL_DIRECT_DAMAGE = 'PHYSICAL_DIRECT_DAMAGE',
    MAGIC_DIRECT_DAMAGE = 'MAGIC_DIRECT_DAMAGE',

    PHYSIC_PERIODIC_DAMAGE = 'PHYSIC_PERIODIC_DAMAGE',
    MAGIC_PERIODIC_DAMAGE = 'MAGIC_PERIODIC_DAMAGE',

    PHYSICAL_INDIVIDUAL_BLOCK = 'PHYSICAL_INDIVIDUAL_BLOCK',
    MAGIC_INDIVIDUAL_BLOCK = 'MAGIC_INDIVIDUAL_BLOCK',
    UNIVERSAL_INDIVIDUAL_BLOCK = 'UNIVERSAL_INDIVIDUAL_BLOCK',

    PHYSICAL_COVER_BLOCK = 'PHYSICAL_COVER_BLOCK',
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
                log.push({source, result: 'error', message: 'No target'});
            }

            switch (effect.type) {
                case EEffectType.PHYSICAL_RANGE_DAMAGE:
                case EEffectType.PHYSICAL_CLOSE_DAMAGE:
                case EEffectType.PHYSICAL_DIRECT_DAMAGE:
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
        return;
    }

    let successPower = effect.power;

    if (!effect.isUnblockable) {
        blocksBeforeTarget.forEach((blocks, idx) => {
            if (successPower === 0) {
                return;
            }

            if (idx === blocksBeforeTarget.length - 1) {
                const blockedIndividualNumber = Math.min(successPower, blocks[EEffectType.PHYSICAL_INDIVIDUAL_BLOCK] || 0);

                if (blockedIndividualNumber) {
                    successPower -= blockedIndividualNumber;
                    blocks[EEffectType.PHYSICAL_INDIVIDUAL_BLOCK] -= blockedIndividualNumber;
                    log.push({source, target: defenders.actors[idx], effect: EEffectType.PHYSICAL_INDIVIDUAL_BLOCK, power: blockedIndividualNumber})
                }
            }

            const blockedNumber = Math.min(successPower, blocks[EEffectType.PHYSICAL_COVER_BLOCK] || 0);

            if (blockedNumber) {
                successPower -= blockedNumber;
                blocks[EEffectType.PHYSICAL_COVER_BLOCK] -= blockedNumber;
                log.push({source, target: defenders.actors[idx], effect: EEffectType.PHYSICAL_COVER_BLOCK, power: blockedNumber})
            }
        })
    }

    console.log("StrikeProcess===>", effect);

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
            })
        }
    }

    return log;
}

export function isSubEffect(effect: IEffect | ISubEffect): effect is ISubEffect {
    return 'target' in effect;
}