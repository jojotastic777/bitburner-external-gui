import RamUsage from "./RamUsage";
import { Player } from "/../NetscriptDefinitions.js";

export default interface GameMessage {
    currentMoney?: number
    currentMoneyString?: string
    player?: Player
    ramUsage?: RamUsage
    runningScriptsCount?: number
}
