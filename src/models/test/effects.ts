//@ts-ignore
import {describe, it} from 'node:test';
import { strict as assert } from 'node:assert';

import {EActorType, IActor, ISide} from "../battle";
import {applyEffects, EEffectType} from "../effects";


describe('Эффекты', () => {
    describe('Атака', () => {
        describe('Дистанция', () => {
            it('Ближняя атака 1-1 должна быть успешной', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], effect: EEffectType.PHYSICAL_CLOSE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[0], effect: EEffectType.MAGIC_CLOSE_DAMAGE, power: 1}
                ]);
            });
            it('Ближняя атака 1-2 должна быть успешной', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[1], effect: EEffectType.PHYSICAL_CLOSE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[1], effect: EEffectType.MAGIC_CLOSE_DAMAGE, power: 1}
                ]);
            });
            it('Ближняя атака 2-1 должна быть успешной', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.deepEqual(log, [
                    {source: attacker.actors[1], target: defender.actors[0], effect: EEffectType.PHYSICAL_CLOSE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[0], effect: EEffectType.MAGIC_CLOSE_DAMAGE, power: 1}
                ]);
            });
            it('Ближняя атака 1-3 должна быть НЕ успешной', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[2],
                        effects: [{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
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
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(3, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
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
                const attacker = createSide(4, 'Атакующий');
                const defender = createSide(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                        source: attacker.actors[0],
                        target: def,
                        effects: [{
                            type: EEffectType.PHYSICAL_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_RANGE_DAMAGE,
                            power: 1,
                        }]
                    })));

                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[0], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[1], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[1], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[2], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[2], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[3], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[0], target: defender.actors[3], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                ]);
            });

            it('Дальняя атака 2-(1..3) должна быть успешной, 2-4 должна быть НЕ успешной', () => {
                const attacker = createSide(4, 'Атакующий');
                const defender = createSide(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                    source: attacker.actors[1],
                    target: def,
                    effects: [{
                        type: EEffectType.PHYSICAL_RANGE_DAMAGE,
                        power: 1,
                    },{
                        type: EEffectType.MAGIC_RANGE_DAMAGE,
                        power: 1,
                    }]
                })));

                assert.deepEqual(log, [
                    {source: attacker.actors[1], target: defender.actors[0], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[0], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[1], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[1], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[2], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[2], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[1], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[1], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                ]);
            });

            it('Дальняя атака 3-(1..2) должна быть успешной, 3-(3..4) должна быть НЕ успешной', () => {
                const attacker = createSide(4, 'Атакующий');
                const defender = createSide(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                    source: attacker.actors[2],
                    target: def,
                    effects: [{
                        type: EEffectType.PHYSICAL_RANGE_DAMAGE,
                        power: 1,
                    },{
                        type: EEffectType.MAGIC_RANGE_DAMAGE,
                        power: 1,
                    }]
                })));

                assert.deepEqual(log, [
                    {source: attacker.actors[2], target: defender.actors[0], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[2], target: defender.actors[0], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[2], target: defender.actors[1], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[2], target: defender.actors[1], effect: EEffectType.MAGIC_RANGE_DAMAGE, power: 1},
                    {source: attacker.actors[2], target: defender.actors[2], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[2], target: defender.actors[2], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[2], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                    {source: attacker.actors[2], target: defender.actors[3], result: 'error', message: 'Target over distance'},
                ]);
            });

            it('Дальняя атака 4-1 должна быть успешной, 4-(2..4) должна быть НЕ успешной', () => {
                const attacker = createSide(4, 'Атакующий');
                const defender = createSide(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                    source: attacker.actors[3],
                    target: def,
                    effects: [{
                        type: EEffectType.PHYSICAL_RANGE_DAMAGE,
                        power: 1,
                    },{
                        type: EEffectType.MAGIC_RANGE_DAMAGE,
                        power: 1,
                    }]
                })));

                assert.deepEqual(log, [
                    {source: attacker.actors[3], target: defender.actors[0], effect: EEffectType.PHYSICAL_RANGE_DAMAGE, power: 1},
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
                const attacker = createSide(4, 'Атакующий');
                const defender = createSide(4, 'Защитник');
                const log = applyEffects(attacker, defender, defender.actors.map((def) => ({
                    source: attacker.actors[3],
                    target: def,
                    effects: [{
                        type: EEffectType.PHYSICAL_DIRECT_DAMAGE,
                        power: 1,
                    },{
                        type: EEffectType.MAGIC_DIRECT_DAMAGE,
                        power: 1,
                    }]
                })));

                assert.deepEqual(log, [
                    {source: attacker.actors[3], target: defender.actors[0], effect: EEffectType.PHYSICAL_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[0], effect: EEffectType.MAGIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[1], effect: EEffectType.PHYSICAL_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[1], effect: EEffectType.MAGIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[2], effect: EEffectType.PHYSICAL_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[2], effect: EEffectType.MAGIC_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[3], effect: EEffectType.PHYSICAL_DIRECT_DAMAGE, power: 1},
                    {source: attacker.actors[3], target: defender.actors[3], effect: EEffectType.MAGIC_DIRECT_DAMAGE, power: 1},
                ]);
            });

        })

        describe('Любой тип атаки приводит к потере здоровья, если не заблокирован', () => {
            it('Физическая, ближняя', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 9, 'Не верный остаток здоровья');
                assert.deepEqual(log, [{source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_CLOSE_DAMAGE}], 'Не верный лог');
            });

            it('Физическая, дистанционная', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSICAL_RANGE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[1].health, 9, 'Не верный остаток здоровья');
                assert.deepEqual(log, [{source: attacker.actors[1], target: defender.actors[1], power: 1, effect: EEffectType.PHYSICAL_RANGE_DAMAGE}], 'Не верный лог');
            });

            it('Физическая, прямая', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSICAL_DIRECT_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[1].health, 9, 'Не верный остаток здоровья');
                assert.deepEqual(log, [{source: attacker.actors[1], target: defender.actors[1], power: 1, effect: EEffectType.PHYSICAL_DIRECT_DAMAGE}], 'Не верный лог');
            });

            it('Магическая, ближняя', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 9, 'Не верный остаток здоровья');
                assert.deepEqual(log, [{source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_CLOSE_DAMAGE}], 'Не верный лог');
            });

            it('Магическая, дистанционная', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.MAGIC_RANGE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[1].health, 9, 'Не верный остаток здоровья');
                assert.deepEqual(log, [
                    {source: attacker.actors[1], target: defender.actors[1], power: 1, effect: EEffectType.MAGIC_RANGE_DAMAGE}
                ]);
            });

            it('Магическая, прямая', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.MAGIC_DIRECT_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[1].health, 9, 'Не верный остаток здоровья');
                assert.deepEqual(log, [{source: attacker.actors[1], target: defender.actors[1], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE}], 'Не верный лог');
            });

            it('Все виды атак сразу', () => {
                const attacker = createSide(2, 'Атакующий');
                const defender = createSide(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.MAGIC_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSICAL_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSICAL_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 4);
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_RANGE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_CLOSE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_DIRECT_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_RANGE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_CLOSE_DAMAGE},
                ]);
            });
        });

        describe('Блокировка атаки', () => {
            it('Магические индивидуальные блоки блокируют магический урон в любой форме', () => {
                const attacker = createSide(1, 'Атакующий');
                const defender = createSide(1, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 4,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.MAGIC_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                ]);
            });

            it('Физические индивидуальные блоки блокируют физический урон в любой форме', () => {
                const attacker = createSide(1, 'Атакующий');
                const defender = createSide(1, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.PHYSICAL_INDIVIDUAL_BLOCK]: 4,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSICAL_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSICAL_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_INDIVIDUAL_BLOCK},
                ]);
            });

            it('Индивидуальные блоки расходуються в первую очередь', () => {
                const attacker = createSide(1, 'Атакующий');
                const defender = createSide(1, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSICAL_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSICAL_COVER_BLOCK]: 2,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSICAL_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSICAL_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(defender.actors[0].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.PHYSICAL_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.MAGIC_COVER_BLOCK]: 1,
                    [EEffectType.PHYSICAL_COVER_BLOCK]: 1,
                });
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_COVER_BLOCK},
                ]);
            });

            it('Ближняя атака через персонажа блокируется промежуточными блоками прикрытия', () => {
                const attacker = createSide(1, 'Атакующий');
                const defender = createSide(2, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSICAL_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSICAL_COVER_BLOCK]: 2,
                };

                defender.actors[1].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSICAL_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSICAL_COVER_BLOCK]: 2,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSICAL_CLOSE_DAMAGE,
                            power: 5,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 5,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(defender.actors[0].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSICAL_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 0,
                    [EEffectType.PHYSICAL_COVER_BLOCK]: 0,
                });
                assert.equal(defender.actors[1].health, 10);
                assert.deepEqual(defender.actors[1].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.PHYSICAL_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.MAGIC_COVER_BLOCK]: 1,
                    [EEffectType.PHYSICAL_COVER_BLOCK]: 1,
                });
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSICAL_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_COVER_BLOCK},
                ]);
            });
        });
    });
});


function createActor(name: string): IActor {
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

function createSide(actorsNumber: number = 1, namePrefix = ''): ISide {
    const actors: IActor[] = [];

    for(let i = 0; i < actorsNumber; i++) {
        actors.push(createActor(`${namePrefix} ${i}`));
    }

    return {
        actors,
    }
}