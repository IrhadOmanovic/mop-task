
import PropTypes from 'prop-types'
import { useSession } from 'next-auth/react'
import { Button } from 'reactstrap'

const EditDeleteButtons = ({
  onDeleteClick,
  onEditClick, show
}) => {
  const { status } = useSession()

  if (status !== 'authenticated' || !show) {
    return null
  }

  return (
    <div>
      <Button
        onClick={() => onEditClick()}
        className='mx-1 px-3'
      >
        Edit
      </Button>
      <Button
        onClick={() => onDeleteClick()}
        className='mx-1 px-3'
      >
        Delete
      </Button>
    </div>
  )
}

EditDeleteButtons.propTypes = {
  onDeleteClick : PropTypes.func,
  onEditClick   : PropTypes.func,
  show          : PropTypes.bool
}

export default EditDeleteButtons
