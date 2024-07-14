import React from 'react'
import { motion } from 'framer-motion'
interface BarProps {
  username: string | null,
  socket: WebSocket | null,
}
function Bar(
  {username, socket}:BarProps)
  {
  return (
    <div className='fixed flex text-white items-center text-xl space-x-3 font-bold bg-cyan-800 p-3 rounded-lg left-10 bottom-10'>
        <div className=''>Hey, {username}</div>
        <motion.button className='bg-gray-900 p-2 rounded-lg' 
        whileTap={{scale: 0.9}}
        whileHover={{scale: 1.1}}
        onClick={()=> {
          socket?.send(JSON.stringify({type: 'EVERYBODY'}))
        }}
        >Ping Everyone!</motion.button>
    </div>
  )
}

export default Bar