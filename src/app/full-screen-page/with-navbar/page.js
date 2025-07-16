'use client';
import FullScreenPageComponent from '@/components/fullScreen/FullScreen'
import React, { useState } from 'react'

const Page = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div className='flex flex-col items-center justify-center py-16'>

        <button
          onClick={() => {
            setCount(count + 1);
            console.log('Button clicked', count);
            setCount((pre => pre + 1));
            console.log('Button clicked', count);
            setCount(count + 1);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Click Me {count}
        </button>
      </div>

      <FullScreenPageComponent />
    </div>
  )
}

export default Page