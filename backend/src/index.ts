import { WebSocketServer, WebSocket } from "ws";
import { SocketHandler } from "./socketHandler";
import { User } from "./types";
import url from 'url';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { generateToken, verifyToken } from "./generateToken";

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json())

app.use(cors({
    origin: 'https://ping-you.netlify.app',
    credentials: true
  }));

app.post('/token', async (req, res) => {
    
    try {
        const {username} = req.body;
        if(!username){
           return res.json({msg: "No Username"})
        }
        const user = {username}
        const token = generateToken(user)
        
        res.json(token)
    } catch (error) {
        console.log(error);
        
    }

})
app.post('/verify', async (req, res) => {
    
    try {
        const {token} = req.body;
        
        if(!token){
           return res.json({msg: "No Username"})
        }
        
        const user = verifyToken(token)
        res.json(user)
    } catch (error) {
        console.log(error);
        
    }

})



const server = http.createServer(app);



const wss = new WebSocketServer({server});
let userId = 1;
wss.on('connection', (ws: WebSocket, req) => {
    // @ts-ignore
    const token: string = url.parse(req.url, true).query.token;
    if(!token){
        ws.close()
    }
    const verified = verifyToken(token)
    
    if(!verified){
        ws.close()   
    }
    
    // @ts-ignore
    const user: User = {ws, userId: userId++, username: verified.username}
    SocketHandler.getInstance().addUser(user)

    ws.on('close', () => {
        SocketHandler.getInstance().removeUser(user.userId)
    })

})

server.listen(port, () => {
    console.log(`Server runnning on port ${port}`);
    
});