import { Player } from "/../NetscriptDefinitions.js";

export default interface GameMessage {
    currentMoney?: number
    currentMoneyString?: string
    player?: Player
}
