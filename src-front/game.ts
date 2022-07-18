import {buildDeck, EEffectType, ESkills} from "../src/models/skills-cards";
import {Battle, EActorType, EUserAction, IActor} from "../src/models/battle";

window.addEventListener('load', () => {
    console.log("Game start!");
    const rat1Deck = buildDeck({
        [ESkills.NATURE]: 1,
        [ESkills.FANGS]: 1,
        [ESkills.PHYSIC_REGENERATION]: 1,
    });

    const rat2Deck = buildDeck({
        [ESkills.NATURE]: 1,
        [ESkills.FANGS]: 1,
        [ESkills.PHYSIC_REGENERATION]: 1,
    });


    const heroDeck = buildDeck({
        [ESkills.PHYSIC_COMBAT]: 1
    });


    const battle = new Battle();

    battle.addActorSideA('Hero', 6, heroDeck, EActorType.Player);
    battle.addActorSideB('Rat', 4, rat1Deck, EActorType.Mob);

    const battleProcess = battle.battleProcess();

    let battleState = battleProcess.next();
    console.log(battleState.value);
    document.getElementById('btn-next').addEventListener('click', () => {
        const selectCards = battleState.value.waitActionFrom
            .map((actor:IActor) => {
                const card = actor.hand[Math.floor(actor.hand.length * Math.random())];
                return {
                    actor,
                    card: card,
                    targets: card.effects.map(effect => {
                        if (effect.type === EEffectType.PHYSICAL_CLOSE_DAMAGE || effect.type === EEffectType.MAGIC_CLOSE_DAMAGE) {
                            return battle.getOtherSideActors(actor)[0]
                        }
                    })
                }
            });

        battleState = battleProcess.next({type: EUserAction.SELECT_CARD, payload: selectCards});
        console.log(battleState.value);
    });



});