import { Spinner } from '@/components/ui/spinner'
import React from 'react'


function LoadingPage() {
  return (
    <div className='h-screen w-full flex items-center justify-center'>
        <Spinner />
    </div>
  )
}

export default LoadingPage