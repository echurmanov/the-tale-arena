//@ts-ignore
import {describe, it} from 'node:test';
import { strict as assert } from 'node:assert';

import {applyEffects, EEffectType} from "../../../effects";
import {createSideStub} from "../../../../utils/stabs";


describe('Эффекты которые активирутся', () => {
    describe('при успешной атаки', () => {
        it('Эффект c фиксрованой силой срабатывает на туже цель, если есть хотя бы одно поподание (у жертвы нет брони)', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                            isSuccessEffects: [
                                {
                                    target: 'same',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                    power: 1
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 8);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
            ]);
        });

        it('Под-эффекты не срабатывают, если аттака не достигла цели', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            defender.actors[0].blocks = {
                [EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK]: 1,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                            isSuccessEffects: [
                                {
                                    target: 'same',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                    power: 1
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 10);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
            ]);
        });

        it('Эффект c фиксрованой силой срабатывает на туже цель, вне зависиости от силы попадания (у жертвы нет брони)', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 2,
                            isSuccessEffects: [
                                {
                                    target: 'same',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                    power: 1
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 7);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
            ]);
        });

        it('Эффект c фиксрованой силой срабатывает на туже цель, если есть хотя бы одно поподание приодолев защиту', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            defender.actors[0].blocks = {
                [EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK]: 1,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 3,
                            isSuccessEffects: [
                                {
                                    target: 'same',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                    power: 1
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 7);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
            ]);
        });

        it('Эффект c фиксрованой силой срабатывает на туже цель, если есть хотя бы одно поподание приодолев защиту (не блокируемая атака)', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            defender.actors[0].blocks = {
                [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 1,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                            isUnblockable: true,
                            isSuccessEffects: [
                                {
                                    target: 'same',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                    power: 1,

                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 8);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
            ]);
        });

        it('Эффект получает силу, равную успеху атаки', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            defender.actors[0].blocks = {
                [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 1,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 3,
                            perSuccessEffects: [
                                {
                                    target: 'same',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 6);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
            ]);
        });

        it('Под-эффект атака взаимодействует с блокими, так же как и обычная атака', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(2, 'Защитник');

            defender.actors[0].blocks = {
                [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 1,
                [EEffectType.PHYSIC_COVER_BLOCK]: 1,
            }

            defender.actors[1].blocks = {
                [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 1,
                [EEffectType.PHYSIC_COVER_BLOCK]: 1,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[1],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                            isUnblockable: true,
                            isSuccessEffects: [
                                {
                                    target: 'same',
                                    type: EEffectType.PHYSIC_RANGE_DAMAGE,
                                    power: 4
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 10);
            assert.equal(defender.actors[1].health, 8);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_COVER_BLOCK},
                {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_COVER_BLOCK},
                {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
            ]);
        });

        it('Успешный эффект может иметь несколько подэффектов (эффекты с фиксированой силой применяються первыми)', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 2,
                            perSuccessEffects: [
                                {
                                    target: 'same',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                },
                                {
                                    target: 'same',
                                    type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                                }
                            ],
                            isSuccessEffects: [
                                {
                                    target: 'same',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                    power: 1,
                                },
                                {
                                    target: 'same',
                                    type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                                    power: 1,
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 2);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
            ]);
        });

        it('Под-эффект применяться на соседние цели', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(3, 'Защитник');

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[1],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 1,
                            isSuccessEffects: [
                                {
                                    target: 'left',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                    power: 1,
                                },
                                {
                                    target: 'right',
                                    type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                                    power: 1,
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 9);
            assert.equal(defender.actors[1].health, 9);
            assert.equal(defender.actors[2].health, 9);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
                {source: attacker.actors[0], target: defender.actors[2], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
            ]);
        })

        it('Под-эффект применяться на соседние цели и не ломается, если их нет', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

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
                                    target: 'left',
                                    type: EEffectType.MAGIC_DIRECT_DAMAGE,
                                    power: 1,
                                },
                                {
                                    target: 'right',
                                    type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                                    power: 1,
                                }
                            ]
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 9);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
            ]);
        })

        it('Под-эффект могут применяться на атакующего', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            attacker.actors[0].health = 5;

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 2,
                            isSuccessEffects: [
                                {
                                    target: 'source',
                                    type: EEffectType.GAIN_HEALTH,
                                    power: 1,
                                },
                            ],
                            perSuccessEffects: [
                                {
                                    target: 'source',
                                    type: EEffectType.GAIN_HEALTH,
                                },
                            ],
                        }
                    ]
                }
            ]);

            assert.equal(attacker.actors[0].health, 8);
            assert.equal(defender.actors[0].health, 8);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                {source: attacker.actors[0], target: attacker.actors[0], power: 6, effect: EEffectType.SET_HEALTH},
                {source: attacker.actors[0], target: attacker.actors[0], power: 8, effect: EEffectType.SET_HEALTH},
            ]);
        })
    });
});
