import {EEffectType, IEffect} from "./effects";
import {ICardTrait} from "./card-traits";

export enum ESkills {
    PHYSIC_COMBAT = 'PHYSIC_COMBAT',
    // MAGIC_COMBAT = 'MAGIC_COMBAT',
    // MIX_COMBAT = 'MIX_COMBAT',
    //
    PHYSIC_VAMPIRE = 'PHYSIC_VAMPIRE',
    // MAGIC_VAMPIRE = 'MAGIC_VAMPIRE',
    // MIX_VAMPIRE = 'MIX_VAMPIRE',

    PHYSIC_REGENERATION = 'PHYSIC_REGENERATION',
    // MAGIC_REGENERATION = 'MAGIC_REGENERATION',
    // MIX_REGENERATION = 'MIX_REGENERATION',

    FANGS = 'FANGS',
    NATURE = 'NATURE',
}

export enum ETrait {
    WEAK_STRIKE = 'WEAK_STRIKE', // Для пробития одного щита требуется два урона
}

export interface ICard {
    name: string;
    skill: ESkills;
    skillLevel: number;
    effects: IEffect[];
    traits: ICardTrait[];
}


export const skillTrees:Record<keyof typeof ESkills, ICard[]> = {
    [ESkills.PHYSIC_COMBAT]: [
        {
            name: 'Punch',
            skill: ESkills.PHYSIC_COMBAT,
            skillLevel: 1,
            effects: [
                {
                    type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                    power: 1,
                }
            ],
            traits: []
        },
        {
            name: 'Kick',
            skill: ESkills.PHYSIC_COMBAT,
            skillLevel: 1,
            effects: [
                {
                    type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                    power: 2,
                }
            ],
            traits: []
        },
        {
            name: 'Block',
            skill: ESkills.PHYSIC_COMBAT,
            skillLevel: 1,
            effects: [
                {
                    type: EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
                    power: 1,
                }
            ],
            traits: []
        },
        {
            name: 'ContrStrike',
            skill: ESkills.PHYSIC_COMBAT,
            skillLevel: 1,
            effects: [
                {
                    type: EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
                    power: 1,
                },
                {
                    type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                    power: 1,
                }
            ],
            traits: []
        },
        {
            name: 'Evade',
            skill: ESkills.PHYSIC_COMBAT,
            skillLevel: 1,
            effects: [
                {
                    type: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK,
                    power: 2,
                }
            ],
            traits: []
        }
    ],

    [ESkills.PHYSIC_REGENERATION]: [
        {
            name: 'Heal in cover',
            skill: ESkills.PHYSIC_REGENERATION,
            skillLevel: 1,
            effects: [
                {
                    type: EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
                    power: 1
                },
                {
                    type: EEffectType.GAIN_HEALTH,
                    power: 1
                }
            ],
            traits: []
        }
    ],

    [ESkills.FANGS]: [
        {
            name: 'Bite',
            skill: ESkills.FANGS,
            skillLevel: 1,
            effects: [
                {
                    type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                    power: 1,
                    isUnblockable: true,
                }
            ],
            traits: []
        }
    ],
    [ESkills.NATURE]: [
        {
            name: 'Claws',
            skill: ESkills.NATURE,
            skillLevel: 1,
            effects: [
                {
                    type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                    power: 1,
                }
            ],
            traits: []
        }
    ],
    [ESkills.PHYSIC_VAMPIRE]: [
        {
            name: 'Bloody Bite',
            skill: ESkills.PHYSIC_VAMPIRE,
            skillLevel: 1,
            effects: [
                {
                    type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                    power: 1,
                    isSuccessEffects: [
                        {
                            type: EEffectType.GAIN_HEALTH,
                            power: 1,
                            target: 'source'
                        }
                    ]
                }
            ],
            traits: []
        },
        {
            name: 'Bloody Hungry Bite',
            skill: ESkills.PHYSIC_VAMPIRE,
            skillLevel: 2,
            effects: [
                {
                    type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                    power: 2,
                    perSuccessEffects: [
                        {
                            type: EEffectType.GAIN_HEALTH,
                            target: 'source',
                            power: 0
                        }
                    ]
                }
            ],
            traits: []
        }
    ]
};

const cardList: ICard[] = [
    {
        name: 'Punch',
        skill: ESkills.PHYSIC_COMBAT,
        skillLevel: 1,
        effects: [
            {
                type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                power: 1,
                isFlash: false,
                isSuccessEffects: [],
                perSuccessEffects: [],
            }
        ],
        traits: []
    },
    {
        name: 'Kick',
        skill: ESkills.PHYSIC_COMBAT,
        skillLevel: 1,
        effects: [
            {
                type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                power: 2,
                isFlash: false,
                isSuccessEffects: [],
                perSuccessEffects: [],
            }
        ],
        traits: []
    },
    {
        name: 'Block',
        skill: ESkills.PHYSIC_COMBAT,
        skillLevel: 1,
        effects: [
            {
                type: EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
                power: 1,
                isFlash: false,
                isSuccessEffects: [],
                perSuccessEffects: [],
            }
        ],
        traits: []
    },
    {
        name: 'ContrStrike',
        skill: ESkills.PHYSIC_COMBAT,
        skillLevel: 1,
        effects: [
            {
                type: EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
                power: 1,
                isFlash: false,
                isSuccessEffects: [],
                perSuccessEffects: [],
            },
            {
                type: EEffectType.PHYSIC_CLOSE_DAMAGE,
                power: 1,
                isFlash: false,
                isSuccessEffects: [],
                perSuccessEffects: [],
            }
        ],
        traits: []
    },
    {
        name: 'Evade',
        skill: ESkills.PHYSIC_COMBAT,
        skillLevel: 1,
        effects: [
            {
                type: EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK,
                power: 1,
                isFlash: false,
                isSuccessEffects: [],
                perSuccessEffects: [],
            }
        ],
        traits: []
    }
];

function cloneCard(card: ICard): ICard {
    return {
        ...card,
        effects: [...card.effects],
    }
}

export function buildDeck(skillsLevels: Partial<Record<keyof typeof ESkills, number>>): ICard[] {
    return Object.keys(skillsLevels).reduce((deck: ICard[], skillName: keyof typeof ESkills) => {
        deck.push(
            ...skillTrees[skillName]
                .filter(card => card.skillLevel <= skillsLevels[skillName])
                .map(card => cloneCard(card))
        );

        return deck;
    }, []);
}
