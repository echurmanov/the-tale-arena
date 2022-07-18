import {EEffectType} from "./effects";

export function isCombatEffect(effect: EEffectType): boolean {
    return isMagicCombatDamageEffect(effect) || isPhysicalCombatDamageEffect(effect);
}

export function isCloseCombatEffect(effect: EEffectType): boolean {
    return [EEffectType.MAGIC_CLOSE_DAMAGE, EEffectType.PHYSICAL_CLOSE_DAMAGE].includes(effect);
}

export function isRangeCombatEffect(effect: EEffectType): boolean {
    return [EEffectType.MAGIC_RANGE_DAMAGE, EEffectType.PHYSICAL_RANGE_DAMAGE].includes(effect);
}

export function isMagicCombatDamageEffect(effect: EEffectType): boolean {
    return [EEffectType.MAGIC_RANGE_DAMAGE, EEffectType.MAGIC_CLOSE_DAMAGE, EEffectType.MAGIC_DIRECT_DAMAGE].includes(effect);
}

export function isPhysicalCombatDamageEffect(effect: EEffectType): boolean {
    return [EEffectType.PHYSICAL_RANGE_DAMAGE, EEffectType.PHYSICAL_CLOSE_DAMAGE, EEffectType.PHYSICAL_DIRECT_DAMAGE].includes(effect);
}

export function isFriendTargetEffect(effect: EEffectType): boolean {
    return [EEffectType.MAGIC_RANGE_DAMAGE, EEffectType.PHYSICAL_RANGE_DAMAGE].includes(effect);
}