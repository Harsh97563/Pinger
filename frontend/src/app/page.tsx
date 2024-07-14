'use client'
import Bar from "@/components/bar";
import { InputBtn } from "@/components/input";
import { TypewriterEffect } from "@/components/typewriter";
import { HoverEffect } from "@/components/user-card";
import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "sonner";
import Loader from "@/components/loader";


export default function Home() {
  const [username, setUsername] = useState< string | null >(null)
  const [socket, setSocket] = useState< WebSocket | null>(null)
  const [activeUsers, setActiveUsers] = useState<[] | {username: string, userId: number}[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [isloading, setIsloading] = useState(true);

  const words = [
    {
      text: "Enter",
    },
    {
      text: "your",
    },
    {
      text: "username.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  useEffect(() => {
    async function getToken(username: string) {
      
      try {
        const token = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token`, {
          username
        })
        localStorage.setItem('token', token.data);
        setToken(token.data)
      } catch (error) {
        console.log(error);
        
      }
      
    }
    async function verifyToken(token: string) {
      
      try {
        const user = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify`, {
          token
        })
        setUsername(user.data.username)
        
      } catch (error) {
        console.log(error);
        
      }
      
    }
    async function initialization() {
      
      let token = localStorage.getItem('token')
      
      if(!token && !username) {
        setIsloading(false)
        return
      }
      
      
      if(token && !username) {
        await verifyToken(token)
        return
        
      }
      
      if(!token && username) {
        await getToken(username)
        return
      }
      
      const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`)
      socket.onopen = () => {
        setSocket(socket)
        setIsloading(false)
      }
      socket.onclose = () => {
        setSocket(null)
      }
  
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log(message);
        
        if(message.type === 'ADD_USER') {
  
          setActiveUsers((prev) => [...prev, message.payload])
          
        }
        if(message.type === 'REMOVE_USER') {
          
          setActiveUsers( activeUsers.filter((userdata) => userdata.userId != message.payload.userId))
          
        }
        if(message.type === 'MESSAGE') {
          toast.custom((t) => (
            <div className="flex text-white items-center space-x-3 font-bold bg-cyan-800 p-3 rounded-lg">
              <h1 className="text-xl">{message.payload.from} pinged you.</h1>
              <button className="bg-gray-900 p-2 rounded-lg" onClick={() => toast.dismiss(t)} >Close</button>
            </div>
          ), {
            duration: 1000
          })
        }
        
      }
    }
    

    initialization()

    return () => {
      socket?.close()
    }
  }, [username, token])

  
  return (
    <div className="">
      <div>
        <HoverEffect socket={socket} items={activeUsers}/>
      </div>
      <div className={`${username ? "hidden" : "fixed"} transition-all duration-1000 z-50 backdrop-blur-sm bg-black/90 top-0 left-0 mx-auto my-auto w-[100vw] h-[100vh] border items-center justify-center`}>
        <div className="flex border w-[100vw] h-[100vh] items-center justify-center">
          <div className=" flex justify-center items-center flex-col min-w-[40vw] min-h-[40vh] space-y-5">
            <div className="flex px-3 min-w-[30vw]">
              <TypewriterEffect words={words} />
            </div>
            {/* @ts-ignore */}
            <InputBtn className="min-w-[30vw]" placeholders={["Enter your username."]} 
            onSubmit={(value) => setUsername(value)
            }/>

          </div>
        </div>
      </div>
      <Bar socket={socket} username={username}/>
      <Loader loading={isloading} />
    </div>
  );
}
