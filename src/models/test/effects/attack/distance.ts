//@ts-ignore
import {describe, it} from 'node:test';
import { strict as assert } from 'node:assert';

import {applyEffects, EEffectType} from "../../../effects";
import {createSideStub} from "../../../../utils/stabs";


describe('Эффекты', () => {
    describe('Атака', () => {
        describe('Дистанция', () => {
            it('Ближняя атака 1-1 должна быть успешной', () => {
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], effect: EEffectType.PHYSIC_CLOSE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[0], effect: EEffectType.MAGIC_CLOSE_DAMAGE, power: 1}
                ]);
            });
            it('Ближняя атака 1-2 должна быть успешной', () => {
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[1], effect: EEffectType.PHYSIC_CLOSE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[1], effect: EEffectType.MAGIC_CLOSE_DAMAGE, power: 1}
                ]);
            });
            it('Ближняя атака 2-1 должна быть успешной', () => {
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.deepEqual(log, [
                    {source: attacker.actors[1], target: defender.actors[0], effect: EEffectType.PHYSIC_CLOSE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[0], effect: EEffectType.MAGIC_CLOSE_DAMAGE, power: 1}
                ]);
            });
            it('Ближняя атака 1-3 должна быть НЕ успешной', () => {
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[2],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[2], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[0], target: defender.actors[2], result: 'error', message: 'Target over distance'}
                ]);
            });

            it('Ближняя атака 2-2 должна быть НЕ успешной', () => {
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.deepEqual(log, [
                    {source: attacker.actors[1], target: defender.actors[1], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[1], target: defender.actors[1], result: 'error', message: 'Target over distance'}
                ]);
            });

            it('Дальняя атака 1-(1..4) должна быть успешной', () => {
                const attacker = createSideStub(4, 'Атакующий');
                const defender = createSideStub(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                    source: attacker.actors[0],
                    target: def,
                    effects: [{
                        type: EEffectType.PHYSIC_RANGE_DAMAGE,
                        power: 1,
                    },{
                        type: EEffectType.MAGIC_RANGE_DAMAGE,
                        power: 1,
                    }]
                })));

                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[0], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[1], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[1], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[2], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[2], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[3], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[3], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                ]);
            });

            it('Дальняя атака 2-(1..3) должна быть успешной, 2-4 должна быть НЕ успешной', () => {
                const attacker = createSideStub(4, 'Атакующий');
                const defender = createSideStub(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                    source: attacker.actors[1],
                    target: def,
                    effects: [{
                        type: EEffectType.PHYSIC_RANGE_DAMAGE,
                        power: 1,
                    },{
                        type: EEffectType.MAGIC_RANGE_DAMAGE,
                        power: 1,
                    }]
                })));

                assert.deepEqual(log, [
                    {source: attacker.actors[1], target: defender.actors[0], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[0], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[1], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[1], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[2], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[2], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[1], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                ]);
            });

            it('Дальняя атака 3-(1..2) должна быть успешной, 3-(3..4) должна быть НЕ успешной', () => {
                const attacker = createSideStub(4, 'Атакующий');
                const defender = createSideStub(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                    source: attacker.actors[2],
                    target: def,
                    effects: [{
                        type: EEffectType.PHYSIC_RANGE_DAMAGE,
                        power: 1,
                    },{
                        type: EEffectType.MAGIC_RANGE_DAMAGE,
                        power: 1,
                    }]
                })));

                assert.deepEqual(log, [
                    {source: attacker.actors[2], target: defender.actors[0], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[2], target: defender.actors[0], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[2], target: defender.actors[1], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[2], target: defender.actors[1], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[2], target: defender.actors[2], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[2], target: defender.actors[2], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[2], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[2], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                ]);
            });

            it('Дальняя атака 4-1 должна быть успешной, 4-(2..4) должна быть НЕ успешной', () => {
                const attacker = createSideStub(4, 'Атакующий');
                const defender = createSideStub(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                    source: attacker.actors[3],
                    target: def,
                    effects: [{
                        type: EEffectType.PHYSIC_RANGE_DAMAGE,
                        power: 1,
                    },{
                        type: EEffectType.MAGIC_RANGE_DAMAGE,
                        power: 1,
                    }]
                })));

                assert.deepEqual(log, [
                    {source: attacker.actors[3], target: defender.actors[0], effect: EEffectType.PHYSIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[0], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[1], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[3], target: defender.actors[1], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[3], target: defender.actors[2], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[3], target: defender.actors[2], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[3], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[3], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                ]);
            });

            it('Прямая атака бьет с любой дистанции', () => {
                const attacker = createSideStub(4, 'Атакующий');
                const defender = createSideStub(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                    source: attacker.actors[3],
                    target: def,
                    effects: [{
                        type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                        power: 1,
                    },{
                        type: EEffectType.MAGIC_DIRECT_DAMAGE,
                        power: 1,
                    }]
                })));

                assert.deepEqual(log, [
                    {source: attacker.actors[3], target: defender.actors[0], effect: EEffectType.PHYSIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[0], effect: EEffectType.MAGIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[1], effect: EEffectType.PHYSIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[1], effect: EEffectType.MAGIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[2], effect: EEffectType.PHYSIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[2], effect: EEffectType.MAGIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[3], effect: EEffectType.PHYSIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[3], effect: EEffectType.MAGIC_DIRECT_DAMAGE, power: 1},
                ]);
            });

        })
    });
});
