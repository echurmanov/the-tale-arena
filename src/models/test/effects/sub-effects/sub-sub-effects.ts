//@ts-ignore
import {describe, it} from 'node:test';
import {strict as assert} from 'node:assert';

import {applyEffects, EEffectType} from "../../../effects";
import {createCard, createSideStub} from "../../../../utils/stabs";

describe('Эффекты которые активирутся', () => {
    describe('и активируют другие эффект', () => {
        it('При атаке, и имеет фиксированную силу', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(2, 'Защитник');

            attacker.actors[0].health = 8;

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1,
                            isSuccessEffects: [
                                {
                                    target: 'right',
                                    type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                                    power: 1,
                                    isSuccessEffects: [{
                                        target: "source",
                                        type: EEffectType.GAIN_HEALTH,
                                        power: 1
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: attacker.actors[0], power: 9, effect: EEffectType.SET_HEALTH},
            ]);
            assert.equal(defender.actors[0].health, 9);
            assert.equal(defender.actors[1].health, 9);
            assert.equal(attacker.actors[0].health, 9);
        });

        it('При атаке, и имеет силу в зависимости от успеха первого под-эффекта', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(2, 'Защитник');

            attacker.actors[0].health = 8;

            defender.actors[1].blocks = {
                [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 1,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1,
                            isSuccessEffects: [
                                {
                                    target: 'right',
                                    type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                                    power: 2,
                                    perSuccessEffects: [{
                                        target: "source",
                                        type: EEffectType.GAIN_HEALTH,
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: attacker.actors[0], power: 9, effect: EEffectType.SET_HEALTH},
            ]);
            assert.equal(defender.actors[0].health, 9);
            assert.equal(defender.actors[1].health, 9);
            assert.equal(attacker.actors[0].health, 9);
        })

        it('При защите, и имеет фиксированную силу', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const card = createCard([{
                type: EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
                power: 1,
                isSuccessEffects: [
                    {
                        target: "same",
                        power: 1,
                        type: EEffectType.PHYSIC_RANGE_DAMAGE,
                        isSuccessEffects: [{
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                            power: 1
                        }]
                    }
                ]
            }])
            defender.actors[0].blocks = {
                [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 1,
            }
            defender.actors[0].preparedAction = {card};
            defender.actors[0].health = 8;

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1
                        }
                    ]
                }
            ]);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                {source: defender.actors[0], target: attacker.actors[0], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                {source: defender.actors[0], target: defender.actors[0], power: 9, effect: EEffectType.SET_HEALTH},
            ]);
            assert.equal(defender.actors[0].health, 9);
            assert.equal(attacker.actors[0].health, 9);
        });

        it('При защите, и имеет силу в зависимости от успеха первого под-эффекта', () => {
            const attacker = createSideStub(2, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const card = createCard([{
                type: EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
                power: 3,
                isSuccessEffects: [
                    {
                        target: "right",
                        type: EEffectType.PHYSIC_RANGE_DAMAGE,
                        power: 2,
                        perSuccessEffects: [{
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                        }]
                    }
                ]
            }])

            defender.actors[0].preparedAction = {card};
            defender.actors[0].health = 7;
            defender.actors[0].blocks = {
                [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 3,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 2,
                        }
                    ]
                }
            ]);


            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                {source: defender.actors[0], target: attacker.actors[1], power: 2, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                {source: defender.actors[0], target: defender.actors[0], power: 9, effect: EEffectType.SET_HEALTH},
            ]);
            assert.equal(attacker.actors[0].health, 10);
            assert.equal(attacker.actors[1].health, 8);
            assert.equal(defender.actors[0].health, 9);
        })
    })
});
