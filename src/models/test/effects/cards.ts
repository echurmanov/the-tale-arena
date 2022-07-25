//@ts-ignore
import {describe, it} from 'node:test';
import { strict as assert } from 'node:assert';

import {applyEffects, EEffectType} from "../../effects";
import {createCard, createSideStub} from "../../../utils/stabs";


describe('Эффекты', () => {
    describe('Карты', () => {
        it('Новая карта добавляется в колоду', () => {
            const attackers = createSideStub(1);
            const defenders = createSideStub(1);

            const card = createCard([]);

            const log = applyEffects(attackers, defenders, [{
                source: attackers.actors[0],
                target: attackers.actors[0],
                effects: [
                    {
                        type: EEffectType.ADD_CARD_TO_DECK,
                        power: 0,
                        extraOptions: card,
                    }
                ]
            }]);

            assert.deepEqual(attackers.actors[0].deck, [card]);
            assert.deepEqual(log, [
                {source: attackers.actors[0], target: attackers.actors[0], effect: EEffectType.ADD_CARD_TO_DECK, extra: {card, shuffle: true}}
            ]);
        });

        it('При добавлении карты, колода переммешивается', () => {
            const attackers = createSideStub(1);
            const defenders = createSideStub(1);

            attackers.actors[0].deck = [
                createCard([], '1'),
                createCard([], '2'),
                createCard([], '3'),
                createCard([], '4'),
            ]

            const newCard = createCard([],'new');

            const log = applyEffects(attackers, defenders, [{
                source: attackers.actors[0],
                target: attackers.actors[0],
                effects: [
                    {
                        type: EEffectType.ADD_CARD_TO_DECK,
                        power: 0,
                        extraOptions: newCard,
                    }
                ]
            }]);

            assert.equal(attackers.actors[0].deck.includes(newCard), true);
            assert.notEqual(attackers.actors[0].deck.join('-'), '1-2-3-4-new');
            assert.deepEqual(log, [
                {source: attackers.actors[0], target: attackers.actors[0], effect: EEffectType.ADD_CARD_TO_DECK, extra: {card: newCard, shuffle: true}}
            ]);
        });
    });
});
