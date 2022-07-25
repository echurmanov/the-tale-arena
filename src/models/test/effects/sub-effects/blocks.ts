//@ts-ignore
import {describe, it} from 'node:test';
import { strict as assert } from 'node:assert';

import {applyEffects, EEffectType} from "../../../effects";
import {createCard, createSideStub} from "../../../../utils/stabs";


describe('Эффекты которые активирутся', () => {
    describe('при успешной защите', () => {
        it('Эффекты с фиксированной силой применятся на защищающегося', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const card = createCard([
                {
                    type: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK,
                    power: 1,
                    isSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                            power: 2,
                        }
                    ]
                }
            ])

            defender.actors[0].health = 5;
            defender.actors[0].preparedAction = {
                card
            };

            defender.actors[0].blocks = {
                [EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK]: +Infinity,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 7);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                {source: defender.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.GAIN_HEALTH},
            ]);
        });

        it('Эффекты с фиксированной силой применятся на атакующего', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const card = createCard([
                {
                    type: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK,
                    power: 1,
                    isSuccessEffects: [
                        {
                            target: "same",
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                        }
                    ]
                }
            ])

            defender.actors[0].preparedAction = {
                card
            };

            defender.actors[0].blocks = {
                [EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK]: +Infinity,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1,
                        }
                    ]
                }
            ]);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                {source: defender.actors[0], target: attacker.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
            ]);

            assert.equal(defender.actors[0].health, 10);
            assert.equal(attacker.actors[0].health, 9);
        });

        it('Эффекты с фиксированной силой срабатывают только для своего типа защиты', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const card = createCard([
                {
                    type: EEffectType.MAGIC_INDIVIDUAL_BLOCK,
                    power: 1,
                    isSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                            power: 1,
                        }
                    ]
                },
                {
                    type: EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
                    power: 1,
                    isSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                            power: 2,
                        }
                    ]
                },
                {
                    type: EEffectType.MAGIC_COVER_BLOCK,
                    power: 1,
                    isSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                            power: 3,
                        }
                    ]
                },
                {
                    type: EEffectType.PHYSIC_COVER_BLOCK,
                    power: 1,
                    isSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                            power: 4,
                        }
                    ]
                }
            ])

            defender.actors[0].health = 1;
            defender.actors[0].preparedAction = {
                card
            };

            defender.actors[0].blocks = {
                [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 1,
                [EEffectType.MAGIC_COVER_BLOCK]: 1,
                [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 1,
                [EEffectType.PHYSIC_COVER_BLOCK]: 1,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 3,
                        },
                        {
                            type: EEffectType.MAGIC_DIRECT_DAMAGE,
                            power: 3,
                        }
                    ]
                }
            ]);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_COVER_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: defender.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.GAIN_HEALTH},
                {source: defender.actors[0], target: defender.actors[0], power: 4, effect: EEffectType.GAIN_HEALTH},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_COVER_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
                {source: defender.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.GAIN_HEALTH},
                {source: defender.actors[0], target: defender.actors[0], power: 3, effect: EEffectType.GAIN_HEALTH},
            ]);
        });

        it('Эффекты с зависимой силой применятся на защищающегося', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const card = createCard([
                {
                    type: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK,
                    power: 2,
                    perSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                        }
                    ]
                }
            ])

            defender.actors[0].health = 5;
            defender.actors[0].preparedAction = {
                card
            };

            defender.actors[0].blocks = {
                [EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK]: 2,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 3,
                        }
                    ]
                }
            ]);

            assert.equal(defender.actors[0].health, 6);
            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: defender.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.GAIN_HEALTH},
            ]);
        });

        it('Эффекты с зависимой силой применятся на атакующего', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const card = createCard([
                {
                    type: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK,
                    power: 2,
                    perSuccessEffects: [
                        {
                            target: "same",
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                        }
                    ]
                }
            ])

            defender.actors[0].preparedAction = {
                card
            };

            defender.actors[0].blocks = {
                [EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK]: 2,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 3,
                        }
                    ]
                }
            ]);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
                {source: defender.actors[0], target: attacker.actors[0], power: 2, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
            ]);

            assert.equal(defender.actors[0].health, 9);
            assert.equal(attacker.actors[0].health, 8);
        });

        it('Эффекты с зависимой силой срабатывают только для своего типа защиты', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(1, 'Защитник');

            const card = createCard([
                {
                    type: EEffectType.MAGIC_INDIVIDUAL_BLOCK,
                    power: 1,
                    perSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                        }
                    ]
                },
                {
                    type: EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
                    power: 2,
                    perSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                        }
                    ]
                },
                {
                    type: EEffectType.MAGIC_COVER_BLOCK,
                    power: 3,
                    perSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                        }
                    ]
                },
                {
                    type: EEffectType.PHYSIC_COVER_BLOCK,
                    power: 4,
                    perSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                        }
                    ]
                }
            ])

            defender.actors[0].health = 1;
            defender.actors[0].preparedAction = {
                card
            };

            defender.actors[0].blocks = {
                [EEffectType.MAGIC_INDIVIDUAL_BLOCK]: 1,
                [EEffectType.MAGIC_COVER_BLOCK]: 2,
                [EEffectType.PHYSIC_INDIVIDUAL_BLOCK]: 3,
                [EEffectType.PHYSIC_COVER_BLOCK]: 4,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[0],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 5,
                        },
                        {
                            type: EEffectType.MAGIC_DIRECT_DAMAGE,
                            power: 5,
                        }
                    ]
                }
            ]);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 3, effect: EEffectType.PHYSIC_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.PHYSIC_COVER_BLOCK},
                {source: defender.actors[0], target: defender.actors[0], power: 3, effect: EEffectType.GAIN_HEALTH},
                {source: defender.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.GAIN_HEALTH},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.MAGIC_INDIVIDUAL_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.MAGIC_COVER_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.MAGIC_DIRECT_DAMAGE},
                {source: defender.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.GAIN_HEALTH},
                {source: defender.actors[0], target: defender.actors[0], power: 2, effect: EEffectType.GAIN_HEALTH},
            ]);
        });

        it('При атаке через персонажа, срабатывают эффекты от его прикрывающих блоков', () => {
            const attacker = createSideStub(1, 'Атакующий');
            const defender = createSideStub(2, 'Защитник');

            const card = createCard([
                {
                    type: EEffectType.UNIVERSAL_COVER_BLOCK,
                    power: 1,
                    isSuccessEffects: [
                        {
                            target: "source",
                            type: EEffectType.GAIN_HEALTH,
                            power: 1
                        }
                    ]
                },
                {
                    type: EEffectType.PHYSIC_COVER_BLOCK,
                    power: 1,
                    isSuccessEffects: [
                        {
                            target: "same",
                            type: EEffectType.PHYSIC_DIRECT_DAMAGE,
                            power: 1
                        }
                    ]
                },
            ])

            defender.actors[0].health = 9;
            defender.actors[0].preparedAction = {
                card
            };

            defender.actors[0].blocks = {
                [EEffectType.UNIVERSAL_COVER_BLOCK]: 1,
                [EEffectType.PHYSIC_COVER_BLOCK]: 1,
            }

            const log = applyEffects(attacker, defender, [
                {
                    source: attacker.actors[0],
                    target: defender.actors[1],
                    effects: [
                        {
                            type: EEffectType.PHYSIC_RANGE_DAMAGE,
                            power: 3,
                        }
                    ]
                }
            ]);

            assert.deepEqual(log, [
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.PHYSIC_COVER_BLOCK},
                {source: attacker.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.UNIVERSAL_COVER_BLOCK},
                {source: attacker.actors[0], target: defender.actors[1], power: 1, effect: EEffectType.PHYSIC_RANGE_DAMAGE},
                {source: defender.actors[0], target: defender.actors[0], power: 1, effect: EEffectType.GAIN_HEALTH},
                {source: defender.actors[0], target: attacker.actors[0], power: 1, effect: EEffectType.PHYSIC_DIRECT_DAMAGE},
            ]);

            assert.equal(attacker.actors[0].health, 9);
            assert.equal(defender.actors[1].health, 9);
            assert.equal(defender.actors[0].health, 10);
        });
    });
});
