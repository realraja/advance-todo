'use client'
import React from 'react'
import { ScaleLoader } from 'react-spinners'

const loading = () => {
  return (
    <div className="h-[90vh] items-center text-center flex">
      <ScaleLoader className="m-auto"   height={120} color={"#F43F5E"} /> 
    </div>
  )
}

export default loading