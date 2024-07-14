
import { DataType, User } from "./types";


export class SocketHandler {
    private static instance: SocketHandler;
    private users:User[] = [];

    constructor() {
        this.users = [];
    }

    static getInstance(): SocketHandler {
        if(!SocketHandler.instance) {
            SocketHandler.instance = new SocketHandler();
        }
        return SocketHandler.instance
    }

    addUser (user: User) {
        this.users.push(user);
        this.addHandler(user);
        this.users.forEach((data) => {
            
            if(data.userId != user.userId){
                user.ws.send(JSON.stringify({ type: "ADD_USER", payload: {userId:data.userId, username: data.username}}))
                data.ws.send(JSON.stringify({type: "ADD_USER", payload:{userId:user.userId, username: user.username} }))
            }
            
            
        })
    }
    removeUser(userId: number) {
        this.users = this.users.filter((user) => user.userId !== userId )
        
        this.users.forEach((data) => {
            data.ws.send(JSON.stringify({type: "REMOVE_USER", payload: {userId:data.userId} }))
            
        })
    }

    addHandler(user: User) {
        user.ws.on('message', (data: DataType) => {
            // @ts-ignore
            const jsonData = JSON.parse(data);
            
            if(jsonData.type == "SELECTED_PERSON"){
                
                try {
                    this.users.find((listedUser) => {
                        
                        if(listedUser.userId === jsonData.payload.to && listedUser.userId !== user.userId) {
                            
                            listedUser.ws.send(JSON.stringify({type: 'MESSAGE', payload: {from: user.username}}));
                        }
                    })
                    
                } catch (error) {
                    console.log(error);
                    
                }
            }

            if(jsonData.type == "EVERYBODY"){
                try {
                    this.users.forEach((listedUser) => {
                        if(listedUser.userId !== user.userId) {
                            listedUser.ws.send(JSON.stringify({type: 'MESSAGE', payload: {from: user.username}}));
                        }
                    })
                    
                } catch (error) {
                    console.log(error);
                    
                }
            }
                
        })
    }
}