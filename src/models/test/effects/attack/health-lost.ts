//@ts-ignore
import {describe, it} from 'node:test';
import { strict as assert } from 'node:assert';

import {applyEffects, EEffectType} from "../../../effects";
import {createSideStub} from "../../../../utils/stabs";


describe('Эффекты', () => {
    describe('Атака', () => {
        describe('Любой тип атаки приводит к потере здоровья, если не заблокирован', () => {
            it('Физическая, ближняя', () => {
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[0],
                        target: defender.actors[0],
                        effects: [{
                            type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[0].health, 9, 'Не верный остаток здоровья');
                assert.deepEqual(log, [{source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_CLOSE_DAMAGE}], 'Не верный лог');
            });

            it('Физическая, дистанционная', () => {
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[1].health, 9, 'Не верный остаток здоровья');
                assert.deepEqual(log, [{source: attacker.actors[1], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE}], 'Не верный лог');
            });

            it('Физическая, прямая', () => {
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');
                const log = applyEffects(attacker, defender, [
                    {
                        source: attacker.actors[1],
                        target: defender.actors[1],
                        effects: [{
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                        }]
                    }
                ]);

                assert.equal(defender.actors[1].health, 9, 'Не верный остаток здоровья');
                assert.deepEqual(log, [{source: attacker.actors[1], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE}], 'Не верный лог');
            });

            it('Магическая, ближняя', () => {
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');
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
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');
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
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');
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
                const attacker = createSideStub(2, 'Атакующий');
                const defender = createSideStub(2, 'Защитник');
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

                assert.equal(defender.actors[0].health, 4);
                assert.deepEqual(log, [
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_RANGE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_CLOSE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                    {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_CLOSE_DAMAGE},
                ]);
            });
        });
    });
});
