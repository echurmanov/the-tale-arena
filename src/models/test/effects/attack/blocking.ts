//@ts-ignore
import {describe, it} from 'node:test';
import { strict as assert } from 'node:assert';

import {applyEffects, EEffectType} from "../../../effects";
import {createSideStub} from "../../../../utils/stabs";


describe('Эффекты', () => {
    describe('Атака', () => {
        describe('Блокировка атаки', () => {
            it('Магические индивидуальные блоки блокируют магический урон в любой форме', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(1, 'Защитник');

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
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(1, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 4,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                ]);
            });

            it('Индивидуальные блоки расходуються в первую очередь', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(1, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
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
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.MAGIC_COVER_BLOCK]: 1,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 1,
                });
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_COVER_BLOCK},
                ]);
            });

            it('Ближняя атака через персонажа блокируется промежуточными блоками прикрытия', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                };

                defender.actors[1].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
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
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 0,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 0,
                });
                assert.equal(defender.actors[1].health, 10);
                assert.deepEqual(defender.actors[1].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.MAGIC_COVER_BLOCK]: 1,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 1,
                });
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.MAGIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.MAGIC_COVER_BLOCK},
                ]);
            });

            it('Дистанционная атака через персонажа блокируется промежуточными блоками прикрытия', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                };

                defender.actors[1].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 5,
                        },{
                            type: EEffectType.MAGIC_RANGE_DAMAGE,
                            power: 5,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(defender.actors[0].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 0,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 0,
                });
                assert.equal(defender.actors[1].health, 10);
                assert.deepEqual(defender.actors[1].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.MAGIC_COVER_BLOCK]: 1,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 1,
                });
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.MAGIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.MAGIC_COVER_BLOCK},
                ]);
            });

            it('Прямая атака через персонажа НЕ блокируется промежуточными блоками прикрытия', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                };

                defender.actors[1].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 3,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 3,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 5,
                        },{
                            type: EEffectType.MAGIC_DIRECT_DAMAGE,
                            power: 5,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(defender.actors[0].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                });
                assert.equal(defender.actors[1].health, 10);
                assert.deepEqual(defender.actors[1].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.MAGIC_COVER_BLOCK]: 0,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 0,
                });
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 3, effect: EEffectType.PHYSIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 3, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.MAGIC_COVER_BLOCK},
                ]);
            });

            it('Универсальные индивидуальные блоки блокируют любой тип урона урон в любой форме', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(1, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK]: 7,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
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
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                ]);
            });

            it('Универсальные прикрывающие блоки блокируют любой тип урона урон в любой форме', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.UNIVERSAL_COVER_BLOCK]: 4,
                };
                defender.actors[1].blocks = {
                    [EEffectType.UNIVERSAL_COVER_BLOCK]: 4,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_DIRECT_DAMAGE,
                            power: 1,
                        },{
                            type: EEffectType.MAGIC_RANGE_DAMAGE,
                            power: 2,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 2,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(defender.actors[0].blocks, {[EEffectType.UNIVERSAL_COVER_BLOCK]: 0});
                assert.equal(defender.actors[1].health, 10);
                assert.deepEqual(defender.actors[1].blocks, {[EEffectType.UNIVERSAL_COVER_BLOCK]: 0});
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.UNIVERSAL_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.UNIVERSAL_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.UNIVERSAL_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.UNIVERSAL_COVER_BLOCK},
                ]);
            });

            it('Атака сверх блоков приводит к потере здоровья', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                };

                defender.actors[1].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 7,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 7,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(defender.actors[0].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 0,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 0,
                });
                assert.equal(defender.actors[1].health, 8);
                assert.deepEqual(defender.actors[1].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 0,
                    [EEffectType.MAGIC_COVER_BLOCK]: 0,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 0,
                });
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.PHYSIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_CLOSE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.MAGIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 2, effect: EEffectType.MAGIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.MAGIC_CLOSE_DAMAGE},
                ]);
            });

            it('Бесконечная индивидуальная защита блокирует любое количество урона', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(1, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: +Infinity,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: +Infinity,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 10000,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 10000,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.deepEqual(defender.actors[0].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: +Infinity,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: +Infinity,
                });
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 10000, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 10000, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                ]);
            });

            it('Бесконечная прикрывающая защита блокирует любое количество урона', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.PHYSIC_COVER_BLOCK]: +Infinity,
                    [EEffectType.MAGIC_COVER_BLOCK]: +Infinity,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 10000,
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 10000,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 10);
                assert.equal(defender.actors[1].health, 10);
                assert.deepEqual(defender.actors[0].blocks, {
                    [EEffectType.PHYSIC_COVER_BLOCK]: +Infinity,
                    [EEffectType.MAGIC_COVER_BLOCK]: +Infinity,
                });
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 10000, effect: EEffectType.PHYSIC_COVER_BLOCK},
                    {source: attacker.actors[0], target: defender.actors[0], power: 10000, effect: EEffectType.MAGIC_COVER_BLOCK},
                ]);
            });

            it('Не блокируемая атака игнорирет блоки', () => {
                const attacker = createSideStub(1, 'Атакующий');
                const defender = createSideStub(1, 'Защитник');

                defender.actors[0].blocks = {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                };

                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 1,
                            isUnblockable: true
                        },{
                            type: EEffectType.MAGIC_CLOSE_DAMAGE,
                            power: 1,
                            isUnblockable: true
                        },{
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1,
                            isUnblockable: true
                        },{
                            type: EEffectType.MAGIC_RANGE_DAMAGE,
                            power: 1,
                            isUnblockable: true
                        },{
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                            isUnblockable: true
                        },{
                            type: EEffectType.MAGIC_DIRECT_DAMAGE,
                            power: 1,
                            isUnblockable: true
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 4);
                assert.deepEqual(defender.actors[0].blocks, {
                    [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 2,
                    [EEffectType.MAGIC_COVER_BLOCK]: 2,
                    [EEffectType.PHYSIC_COVER_BLOCK]: 2,
                });

                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_CLOSE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_CLOSE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_RANGE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
                ]);
            });
        });
    });
});
