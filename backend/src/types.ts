import WebSocket from 'ws'


export interface User {
    ws: WebSocket;
    userId: number; 
    username: string; 
}
export interface DataType {
    type: "SELECTED_PERSON" | "INDIVIDUAL";
    to: number | null;
    message: string;
}