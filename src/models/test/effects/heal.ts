//@ts-ignore
import {describe, it} from 'node:test';
import { strict as assert } from 'node:assert';

import {applyEffects, EEffectType} from "../../effects";
import {createSideStub} from "../../../utils/stabs";


describe('Эффекты', () => {
    describe('Лечение', () => {
        it('Лечение на определенное количество', () => {
            const attackers = createSideStub(1);
            const defenders = createSideStub(1);

            attackers.actors[0].health = 5;

            const log = applyEffects(attackers, defenders, [{
                source: attackers.actors[0],
                target: attackers.actors[0],
                effects: [
                    {
                        type: EEffectType.GAIN_HEALTH,
                        power: 3
                    }
                ]
            }]);

            assert.equal(attackers.actors[0].health, 8);
            assert.deepEqual(log, [
                {source: attackers.actors[0], target: attackers.actors[0], effect: EEffectType.GAIN_HEALTH, power: 3}
            ]);
        });

        it('Лечение НЕ должно увеличивать жизни болшьше максимума', () => {
            const attackers = createSideStub(1);
            const defenders = createSideStub(1);

            attackers.actors[0].health = 8;

            const log = applyEffects(attackers, defenders, [{
                source: attackers.actors[0],
                target: attackers.actors[0],
                effects: [
                    {
                        type: EEffectType.GAIN_HEALTH,
                        power: 3
                    }
                ]
            }]);

            assert.equal(attackers.actors[0].health, 10);
            assert.deepEqual(log, [
                {source: attackers.actors[0], target: attackers.actors[0], effect: EEffectType.GAIN_HEALTH, power: 2}
            ]);
        });

        it('Установка количества жизней', () => {
            const attackers = createSideStub(1);
            const defenders = createSideStub(1);

            attackers.actors[0].health = 1;

            const log = applyEffects(attackers, defenders, [{
                source: attackers.actors[0],
                target: attackers.actors[0],
                effects: [
                    {
                        type: EEffectType.SET_HEALTH,
                        power: 5
                    }
                ]
            },{
                source: defenders.actors[0],
                target: defenders.actors[0],
                effects: [
                    {
                        type: EEffectType.SET_HEALTH,
                        power: 5
                    }
                ]
            }]);

            assert.equal(attackers.actors[0].health, 5);
            assert.equal(defenders.actors[0].health, 5);
            assert.deepEqual(log, [
                {source: attackers.actors[0], target: attackers.actors[0], effect: EEffectType.SET_HEALTH, power: 5},
                {source: defenders.actors[0], target: defenders.actors[0], effect: EEffectType.SET_HEALTH, power: 5},
            ]);
        });
    });
});
