import {shuffle} from "../utils/array-shuffler";

import {ICard} from "./skills-cards";
import {applyEffects, EEffectType, TBlockEffect} from "./effects";
import {actorTakeCard, EActorType, IActor, IDrawCardResult} from "./actor/actor";


export enum EBattleType {
    PvP = 'PvP',
    PvE = 'PvE',
}

export enum ETurnStage {
    TURN_START = 'TURN_START',
    SELECT_ATTACKERS_CARD = 'SELECT_ATTACKERS_CARD',
    SELECT_DEFENDERS_CARD = 'SELECT_DEFENDERS_CARD',
    GENERATE_BLOCKS = 'GENERATE_BLOCKS',
    APPLY_ATTACKER_FAST_EFFECTS = 'APPLY_ATTACKER_FAST_EFFECTS',
    APPLY_DEFENDER_FAST_EFFECTS = 'APPLY_DEFENDER_FAST_EFFECTS',
    APPLY_ATTACKER_NORMAL_EFFECTS = 'APPLY_ATTACKER_NORMAL_EFFECTS',
    APPLY_DEFENDER_NORMAL_EFFECTS = 'APPLY_DEFENDER_NORMAL_EFFECTS',
    APPLY_END_TURN_EFFECTS = 'APPLY_END_TURN_EFFECTS',
}


interface IBattleState {
    turnNumber: number;
    turnStage: ETurnStage;
    isEnd: boolean;
    waitActionFrom: IActor[];
    events: any[]
}

export enum EUserAction {
    SELECT_CARD = 'SELECT_CARD',
}

export interface IUserAction {
    type: EUserAction;
    payload: any;
}



export interface ISide {
    actors: IActor[];
}

const BLOCK_EFFECT_LIST: EEffectType[] = [
    EEffectType.PHYSIC_INDIVIDUAL_BLOCK,
    EEffectType.MAGIC_INDIVIDUAL_BLOCK,
    EEffectType.UNIVERSAL_INDIVIDUAL_BLOCK,

    EEffectType.PHYSIC_COVER_BLOCK,
    EEffectType.MAGIC_COVER_BLOCK,
    EEffectType.UNIVERSAL_COVER_BLOCK,
];

export function isBlockEffect(effect: EEffectType): effect is TBlockEffect {
    return BLOCK_EFFECT_LIST.includes(effect);
}

const NEXT_STAGE: Partial<Record<ETurnStage, ETurnStage>> = {
    [ETurnStage.TURN_START]: ETurnStage.SELECT_ATTACKERS_CARD,
    [ETurnStage.SELECT_ATTACKERS_CARD]: ETurnStage.SELECT_DEFENDERS_CARD,
    [ETurnStage.SELECT_DEFENDERS_CARD]: ETurnStage.GENERATE_BLOCKS,
    [ETurnStage.GENERATE_BLOCKS]: ETurnStage.APPLY_ATTACKER_FAST_EFFECTS,
    [ETurnStage.APPLY_ATTACKER_FAST_EFFECTS]: ETurnStage.APPLY_DEFENDER_FAST_EFFECTS,
    [ETurnStage.APPLY_DEFENDER_FAST_EFFECTS]: ETurnStage.APPLY_ATTACKER_NORMAL_EFFECTS,
    [ETurnStage.APPLY_ATTACKER_NORMAL_EFFECTS]: ETurnStage.APPLY_DEFENDER_NORMAL_EFFECTS,
    [ETurnStage.APPLY_DEFENDER_NORMAL_EFFECTS]: ETurnStage.APPLY_END_TURN_EFFECTS,
    [ETurnStage.APPLY_END_TURN_EFFECTS]: ETurnStage.TURN_START,
}

export class Battle {
    private readonly sideA: ISide;
    private readonly sideB: ISide;
    private readonly type: EBattleType;

    private turnNumber: number;
    private turnStage: ETurnStage;

    constructor() {
        this.turnStage = ETurnStage.TURN_START;
        this.turnNumber = 0;
        this.type = EBattleType.PvE;

        this.sideA = {
            actors: [],
        };
        this.sideB = {
            actors: [],
        }
    }

    private static createActor(name: string, maxHealth: number, baseDeck: ICard[], type: EActorType): IActor {
        return {
            name,
            maxHealth,
            health: maxHealth,
            deck: shuffle<ICard>(baseDeck.slice()),
            hand: [],
            discards: [],
            type,
            blocks: {},
            traits: []
        };
    }

    private getAttackerSide() {
        if (this.type === EBattleType.PvE || this.turnNumber % 2 === 1) {
            return this.sideB;
        }

        return this.sideA;
    }

    private getDefenderSide() {
        if (this.type === EBattleType.PvE || this.turnNumber % 2 === 1) {
            return this.sideA;
        }

        return this.sideB;
    }

    private isBattleEnded() {
        return this.sideA.actors.every(actor => actor.health === 0)
            || this.sideB.actors.every(actor => actor.health === 0);
    }

    addActorSideA(name: string, maxHealth: number, baseDeck: ICard[], type: EActorType) {
        this.sideA.actors.push(Battle.createActor(name, maxHealth, baseDeck, type));
    }

    addActorSideB(name: string, maxHealth: number, baseDeck: ICard[], type: EActorType) {
        this.sideB.actors.push(Battle.createActor(name, maxHealth, baseDeck, type));
    }

    public getOtherSideActors(actor: IActor): IActor[] {
        if (this.sideA.actors.includes(actor)) {
            return [...this.sideB.actors];
        } else {
            return [...this.sideA.actors];
        }
    }

    private getBattleState(additionalInfo?: any): IBattleState {
        const stats:IBattleState = {
            turnNumber: this.turnNumber,
            turnStage: this.turnStage,
            isEnd: this.isBattleEnded(),
            waitActionFrom: this.getActionWaitingActors(),
            events: []
        };

        if (additionalInfo) {
            stats.events.push(additionalInfo);
        }

        return stats;
    }

    private getActionWaitingActors() {
        if (this.turnStage === ETurnStage.SELECT_ATTACKERS_CARD) {
            return this.getAttackerSide().actors.filter(actor => !actor.preparedAction);
        }

        if (this.turnStage === ETurnStage.SELECT_DEFENDERS_CARD) {
            return this.getDefenderSide().actors.filter(actor => !actor.preparedAction);
        }

        return [];
    }

    private resetSideBlocks(side: ISide) {
        side.actors.forEach(actor => {
            BLOCK_EFFECT_LIST.forEach((effectName: TBlockEffect) => actor.blocks[effectName] = 0)
        })
    }

    private turnStart() {
        const drawResult = [
            ...this.sideA.actors.map(actor => actorTakeCard(actor)),
            ...this.sideB.actors.map(actor => actorTakeCard(actor))
        ];
        this.resetSideBlocks(this.sideA);
        this.resetSideBlocks(this.sideB);

        this.turnStage = NEXT_STAGE[this.turnStage];

        return this.getBattleState(drawResult);
    }

    private selectCards() {
        if (this.getActionWaitingActors().length === 0) {
            this.turnStage = NEXT_STAGE[this.turnStage];
        }
    }

    private generateBlocks() {
        [...this.sideA.actors, ...this.sideB.actors].forEach((actor) => {
            actor.preparedAction.card.effects.forEach(effect => {
                if (isBlockEffect(effect.type)) {
                    actor.blocks[effect.type] += effect.power;
                }
            })
        });

        this.turnStage = NEXT_STAGE[this.turnStage];
    }

    *battleProcess(): Generator<IBattleState | undefined> {
        while(!this.isBattleEnded()) {
            const input = yield this.getBattleState();
            if (input) {
                const externalAction:IUserAction = input as IUserAction;

                switch (externalAction.type) {
                    case EUserAction.SELECT_CARD:
                        const actualSide = this.turnStage === ETurnStage.SELECT_ATTACKERS_CARD ? this.getAttackerSide()
                            : this.getDefenderSide();
                        externalAction.payload.forEach((data: {actor: IActor, card: ICard, target?: IActor}) => {
                            if (actualSide.actors.includes(data.actor) && !data.actor.preparedAction) {
                                data.actor.preparedAction = {
                                    card: data.card,
                                    target: data.target,
                                }
                            }
                        });
                        break;
                }
            }

            switch (this.turnStage) {
                case ETurnStage.TURN_START:
                    yield this.turnStart();
                    break;
                case ETurnStage.SELECT_ATTACKERS_CARD:
                case ETurnStage.SELECT_DEFENDERS_CARD:
                    this.selectCards();
                    break;
                case ETurnStage.GENERATE_BLOCKS:
                    this.generateBlocks();
                    break;
                case ETurnStage.APPLY_ATTACKER_FAST_EFFECTS:
                case ETurnStage.APPLY_ATTACKER_NORMAL_EFFECTS:
                case ETurnStage.APPLY_DEFENDER_FAST_EFFECTS:
                case ETurnStage.APPLY_DEFENDER_NORMAL_EFFECTS:
                    let attackers = this.getAttackerSide();
                    let defenders = this.getDefenderSide();

                    if (this.turnStage === ETurnStage.APPLY_DEFENDER_FAST_EFFECTS || this.turnStage === ETurnStage.APPLY_DEFENDER_NORMAL_EFFECTS) {
                        attackers = this.getDefenderSide();
                        defenders = this.getAttackerSide();
                    }

                    const effects = attackers.actors.filter(actor => actor.preparedAction).map( actor => ({
                        source: actor,
                        target: actor.preparedAction.target,
                        effects: actor.preparedAction.card.effects.filter(
                            effect => isCurrentStageEffect(this.turnStage, effect.isFlash)
                        )
                    }));

                    const actionsLog = applyEffects(attackers, defenders,  effects);

                    this.turnStage = NEXT_STAGE[this.turnStage] || this.turnStage;

                    break;
                case ETurnStage.APPLY_END_TURN_EFFECTS:
                    this.turnNumber++;
                    const endTurnLog: IDrawCardResult[] = [];
                    [...this.sideA.actors, ...this.sideB.actors].forEach(actor => {
                        const actionCardInHandIndex = actor.hand.indexOf(actor.preparedAction.card);
                        if (actionCardInHandIndex !== -1) {
                            actor.discards.push(actor.preparedAction.card);
                            actor.hand.splice(actionCardInHandIndex, 1);
                        }

                        actor.preparedAction = undefined;
                    })

                    console.log(endTurnLog);

                    this.turnStage = NEXT_STAGE[this.turnStage];
                    break;
            }

        }

        return {
            isEnd: true
        }
    }
}


function isCurrentStageEffect(stage: ETurnStage, isFastEffect: boolean): boolean {
    const isFastStage = stage === ETurnStage.APPLY_ATTACKER_FAST_EFFECTS || stage === ETurnStage.APPLY_DEFENDER_FAST_EFFECTS;

    return (isFastStage && isFastEffect) || (!isFastStage && !isFastEffect);
}


