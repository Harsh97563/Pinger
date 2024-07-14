import { Loader2 } from 'lucide-react'
import React from 'react'

function Loader({loading}: {loading: boolean}) {
  return (
    <div className={`${loading ? "flex" : "hidden"} fixed top-0 left-0 z-50 items-center justify-center w-full h-full bg-slate-600`}>
        <div className='flex flex-col space-y-5 justify-center items-center'>
            <h1 className='text-4xl font-bold'>Using free tier of render so backend is slow.It can take upto 50s.</h1>
            <Loader2 size={80} className=' animate-spin'/>
            
        </div>
    </div>
  )
}

export default Loader