import React from 'react'
import Confirmation from '../components/Confirmation'
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div><Confirmation></Confirmation>
    <div className='flex items-center justify-center '>
      <Button className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'  onClick="/signin" >
        Sign In </Button>
    </div>

    </div>
  )
}

export default page