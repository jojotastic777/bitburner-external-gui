import GameMessage from "/common/GameMessage.js"

function calculateSkill(exp: number, mult = 1): number {
    return Math.max(Math.floor(mult * (32 * Math.log(exp + 534.5) - 200)), 1);
}

function calculateExp(skill: number, mult = 1): number {
    return Math.exp((skill / mult + 200) / 32) - 534.6;
}

const ws = new WebSocket("ws://127.0.0.1:9453/viewer")

document.onclose = (e) => {
    ws.close()
}

const currMoneyElem      = document.getElementById("curr-money-value") as HTMLElement

const playerHpElem       = document.getElementById("player-hp-value") as HTMLElement
const playerHpProgElem   = document.getElementById("player-hp-progress") as HTMLElement

const playerHackElem     = document.getElementById("player-hack-value") as HTMLElement
const playerHackProgElem = document.getElementById("player-hack-progress") as HTMLElement

const playerStrElem      = document.getElementById("player-strength-value") as HTMLElement
const playerStrProgElem  = document.getElementById("player-strength-progress") as HTMLElement

const playerDefElem      = document.getElementById("player-defence-value") as HTMLElement
const playerDefProgElem  = document.getElementById("player-defence-progress") as HTMLElement

const playerDexElem      = document.getElementById("player-dexterity-value") as HTMLElement
const playerDexProgElem  = document.getElementById("player-dexterity-progress") as HTMLElement

const playerAgiElem      = document.getElementById("player-agility-value") as HTMLElement
const playerAgiProgElem  = document.getElementById("player-agility-progress") as HTMLElement

const playerChaElem      = document.getElementById("player-charisma-value") as HTMLElement
const playerChaProgElem  = document.getElementById("player-charisma-progress") as HTMLElement

const localRamElem       = document.getElementById("local-ram-value") as HTMLElement
const localRamAvailElem  = document.getElementById("local-ram-avail-value") as HTMLElement
const localRamProgElem   = document.getElementById("local-ram-progress") as HTMLElement

const netRamElem         = document.getElementById("net-ram-value") as HTMLElement
const netRamAvailElem    = document.getElementById("net-ram-avail-value") as HTMLElement
const netRamProgElem     = document.getElementById("net-ram-progress") as HTMLElement

const runningScriptsElem = document.getElementById("running-scripts-count-value") as HTMLElement

ws.onmessage = (e => {
    let message: GameMessage = JSON.parse(e.data.toString())

    currMoneyElem.innerText = message.currentMoneyString ?? currMoneyElem.innerText
    
    if (message.player !== undefined) {
        playerHpElem.innerText = `${message.player.hp}/${message.player.max_hp}`
        playerHpProgElem.style.width = `${message.player.hp/message.player.max_hp*100}%`

        let currHackSkillExp = calculateExp(message.player.hacking, message.player.hacking_mult)
        let nextHackSkillExp = calculateExp(message.player.hacking + 1, message.player.hacking_mult)
        let diffHackSkillExp = nextHackSkillExp - currHackSkillExp
        playerHackElem.innerText = message.player.hacking.toString()
        playerHackProgElem.style.width = `${(message.player.hacking_exp - currHackSkillExp) / diffHackSkillExp * 100}%`

        let currStrSkillExp = calculateExp(message.player.strength, message.player.strength_mult)
        let nextStrSkillExp = calculateExp(message.player.strength + 1, message.player.strength_mult)
        let diffStrSkillExp = nextStrSkillExp - currStrSkillExp
        playerStrElem.innerText = message.player.strength.toString()
        playerStrProgElem.style.width = `${(message.player.strength_exp - currStrSkillExp) / diffStrSkillExp * 100}%`

        let currDefSkillExp = calculateExp(message.player.defense, message.player.defense_mult)
        let nextDefSkillExp = calculateExp(message.player.defense + 1, message.player.defense_mult)
        let diffDefSkillExp = nextDefSkillExp - currDefSkillExp
        playerDefElem.innerText = message.player.strength.toString()
        playerDefProgElem.style.width = `${(message.player.defense_exp - currDefSkillExp) / diffDefSkillExp * 100}%`

        let currDexSkillExp = calculateExp(message.player.dexterity, message.player.dexterity_mult)
        let nextDexSkillExp = calculateExp(message.player.dexterity + 1, message.player.dexterity_mult)
        let diffDexSkillExp = nextDexSkillExp - currDexSkillExp
        playerDexElem.innerText = message.player.dexterity.toString()
        playerDexProgElem.style.width = `${(message.player.dexterity_exp - currDexSkillExp) / diffDexSkillExp * 100}%`

        let currAgiSkillExp = calculateExp(message.player.agility, message.player.agility_mult)
        let nextAgiSkillExp = calculateExp(message.player.agility + 1, message.player.agility_mult)
        let diffAgiSkillExp = nextAgiSkillExp - currAgiSkillExp
        playerAgiElem.innerText = message.player.agility.toString()
        playerAgiProgElem.style.width = `${(message.player.agility_exp - currAgiSkillExp) / diffAgiSkillExp * 100}%`

        let currChaSkillExp = calculateExp(message.player.charisma, message.player.charisma_mult)
        let nextChaSkillExp = calculateExp(message.player.charisma + 1, message.player.charisma_mult)
        let diffChaSkillExp = nextChaSkillExp - currChaSkillExp
        playerChaElem.innerText = message.player.charisma.toString()
        playerChaProgElem.style.width = `${(message.player.charisma_exp - currChaSkillExp) / diffChaSkillExp * 100}%`
    }

    if (message.ramUsage !== undefined) {
        localRamElem.innerText = `${message.ramUsage.local.used.toFixed(2)}GB/${message.ramUsage.local.max.toFixed(2)}GB`
        localRamAvailElem.innerText = `${message.ramUsage.local.avail.toFixed(2)}GB`
        localRamProgElem.style.width = `${message.ramUsage.local.used / message.ramUsage.local.max * 100}%`

        netRamElem.innerText = `${message.ramUsage.network.used.toFixed(2)}GB/${message.ramUsage.network.max.toFixed(2)}GB`
        netRamAvailElem.innerText = `${message.ramUsage.network.avail.toFixed(2)}GB`
        netRamProgElem.style.width = `${message.ramUsage.network.used / message.ramUsage.network.max * 100}%`
    }

    if (message.runningScriptsCount !== undefined) {
        runningScriptsElem.innerText = message.runningScriptsCount.toString()
    }
})
