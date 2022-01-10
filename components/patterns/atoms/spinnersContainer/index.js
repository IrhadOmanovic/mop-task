import React from 'react'
import { Spinner } from 'reactstrap'
import { useSession } from 'next-auth/react'

const SpinnersContainer = () => {
  const { status } = useSession()

  if (status === 'loading') {
    return (
      <div className='my-2 clearfix'>
        <div className='float-start'><Spinner /></div>
        <div className='float-end'><Spinner /></div>
      </div>
    )
  }
  return null
}

export default SpinnersContainer
