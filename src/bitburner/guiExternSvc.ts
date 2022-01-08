import { NS } from "/../NetscriptDefinitions.js";
import GameMessage from "/common/GameMessage.js";

function sendGameMessage(ws: WebSocket, msg: GameMessage): void {
    ws.send(JSON.stringify(msg))
}

export async function main(ns: NS) {
    let ws = new WebSocket("ws://127.0.0.1:9453/game")
    let connected = false

    ws.onopen = () => {
        connected = true
    }

    ws.onclose = () => {
        ns.toast("Closed connection to External GUI Server.", "warning")
        connected = false
    }

    ws.onerror = () => {
        ns.toast("External GUI Server Connection Error", "error")
    }

    ns.atExit(() => {
        ws.close()
    })

    while (true) {
        if (connected) {
            // Send current money.
            sendGameMessage(ws, {
                currentMoney: ns.getServerMoneyAvailable("home"),
                currentMoneyString: ns.nFormat(ns.getServerMoneyAvailable("home"), "($0.000a)")
            })
            // Send current player data.
            sendGameMessage(ws, {
                player: ns.getPlayer()
            })
        }

        await ns.asleep(250)
    }
}