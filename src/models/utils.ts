import {EEffectType, TBlockEffect} from "./effects";

export function isCombatEffect(effect: EEffectType): boolean {
    return isMagicCombatDamageEffect(effect) || isPhysicalCombatDamageEffect(effect);
}

export function isCloseCombatEffect(effect: EEffectType): boolean {
    return [EEffectType.MAGIC_CLOSE_DAMAGE, EEffectType.PHYSIC_CLOSE_DAMAGE].includes(effect);
}

export function isRangeCombatEffect(effect: EEffectType): boolean {
    return [EEffectType.MAGIC_RANGE_DAMAGE, EEffectType.PHYSIC_RANGE_DAMAGE].includes(effect);
}

export function isDirectCombatEffect(effect: EEffectType): boolean {
    return [EEffectType.MAGIC_DIRECT_DAMAGE, EEffectType.PHYSIC_DIRECT_DAMAGE].includes(effect);
}

export function isMagicCombatDamageEffect(effect: EEffectType): boolean {
    return [EEffectType.MAGIC_RANGE_DAMAGE, EEffectType.MAGIC_CLOSE_DAMAGE, EEffectType.MAGIC_DIRECT_DAMAGE].includes(effect);
}

export function isPhysicalCombatDamageEffect(effect: EEffectType): boolean {
    return [EEffectType.PHYSIC_RANGE_DAMAGE, EEffectType.PHYSIC_CLOSE_DAMAGE, EEffectType.PHYSIC_DIRECT_DAMAGE].includes(effect);
}

export function isBlockingEffect(effect: EEffectType): boolean {
    return [
        EEffectType.MAGIC_COVER_BLOCK,
        EEffectType.PHYSIC_COVER_BLOCK,
        EEffectType.UNIVERSAL_COVER_BLOCK,
        EEffectType.MAGIC_INDIVIDUAL_BLOCK,
        EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
        EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK
    ].includes(effect);
}

export function isBlockingType(effectType: EEffectType): effectType is TBlockEffect {
    return [
        EEffectType.MAGIC_COVER_BLOCK,
        EEffectType.PHYSIC_COVER_BLOCK,
        EEffectType.UNIVERSAL_COVER_BLOCK,
        EEffectType.MAGIC_INDIVIDUAL_BLOCK,
        EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
        EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK
    ].includes(effectType);
}
