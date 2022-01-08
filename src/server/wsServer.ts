import http from "http"
import WebSocket, { WebSocketServer } from "ws"
import GameMessage from "/common/GameMessage.js"

const PORT: number = parseInt(process.env.PORT ?? "9453")

const server    = http.createServer()
const wssGame   = new WebSocketServer({ noServer: true })
const wssViewer = new WebSocketServer({ noServer: true })

let gameSockets: WebSocket[]   = []
let viewerSockets: WebSocket[] = []

let gameState: GameMessage = {}

wssGame.on("connection", (ws, req) => {
    console.log(`Connection from game: '${req.socket.remoteAddress}'.`)
    gameSockets.push(ws)

    ws.on("message", (data) => {
        let message: GameMessage = JSON.parse(data.toString())

        console.log(`Message from '${req.socket.remoteAddress}':`, message)
        gameState = { ...gameState, ...message } // Update the game state.
        viewerSockets.forEach(s => s.send(data.toString())) // Forward the message to all viewers.
    })

    ws.on("close", () => {
        console.log(`Lost connection to game: '${req.socket.remoteAddress}'.`)
        gameSockets = gameSockets.filter(s => s !== ws)
    })
})

wssViewer.on("connection", (ws, req) => {
    console.log(`Connection from viewer: '${req.socket.remoteAddress}'.`)
    viewerSockets.push(ws)

    ws.send(JSON.stringify(gameState)) // Tell all viewers about the current game state.

    ws.on("close", () => {
        console.log(`Lost connection to viewer: '${req.socket.remoteAddress}'.`)
        viewerSockets = viewerSockets.filter(s => s !== ws)
    })
})

server.on("upgrade", (req, socket, head) => {
    const pathname = req.url ?? ""

    if (pathname === "/game") {
        wssGame.handleUpgrade(req, socket, head, (ws) => {
            wssGame.emit("connection", ws, req)
        })
    } else if (pathname === "/viewer") {
        wssViewer.handleUpgrade(req, socket, head, (ws) => {
            wssViewer.emit("connection", ws, req)
        })
    } else {
        socket.destroy()
    }
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`)
})
