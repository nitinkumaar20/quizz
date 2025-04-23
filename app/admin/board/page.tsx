import React from 'react'
import ExamBoardManager from './Board'

const Boardpage = () => {
  return (
    <div className='h-screen overflow-y-auto p-4 bg-gray-50 w-full'>
      <ExamBoardManager/>
    </div>
  )
}

export default Boardpage
