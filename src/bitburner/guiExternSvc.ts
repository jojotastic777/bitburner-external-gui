import { NS } from "/../NetscriptDefinitions.js";
import GameMessage from "/common/GameMessage.js";
import RamUsage from "/common/RamUsage.js";

function sendGameMessage(ws: WebSocket, msg: GameMessage): void {
    ws.send(JSON.stringify(msg))
}

function scan(ns: NS): string[] {
    let servers: string[] = [ "home" ]

    let oldServersLen = 0

    while (oldServersLen < servers.length) {
        oldServersLen = servers.length
        servers = [ ...new Set([ ...servers, ...servers.map(srv => ns.scan(srv)).reduce((acc, cur) => acc.concat(cur)) ]) ]
    }

    return servers
}

function getRam(ns: NS): RamUsage {
    const SERVERS = scan(ns).filter(host => ns.hasRootAccess(host))

    const NET_MAX_RAM   = SERVERS.map(host => ns.getServerMaxRam(host)).reduce((acc, cur) => acc + cur)
    const NET_USED_RAM  = SERVERS.map(host => ns.getServerUsedRam(host)).reduce((acc, cur) => acc + cur)
    const NET_AVAIL_RAM = NET_MAX_RAM - NET_USED_RAM

    return {
        local: {
            max:   ns.getServerMaxRam("home"),
            used:  ns.getServerUsedRam("home"),
            avail: ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
        },

        network: {
            max:   NET_MAX_RAM,
            used:  NET_USED_RAM,
            avail: NET_AVAIL_RAM
        }
    }
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
            // Send current RAM data.
            sendGameMessage(ws, {
                ramUsage: getRam(ns)
            })
            // Send running scripts count.
            sendGameMessage(ws, {
                runningScriptsCount: scan(ns).map(host => ns.ps(host).length).reduce((acc, cur) => acc + cur)
            })
        }

        await ns.asleep(250)
    }
}