import PropTypes from 'prop-types'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

import IconButton from '../../atoms/iconButton'

const RatingButtons = ({
  onClickLike,
  onClickDislike,
  likeActive,
  dislikeActive
}) => {
  return (
    <div className='ms-auto'>
      <IconButton
        active={likeActive}
        icon={faThumbsUp}
        onClick={onClickLike}
      />
      <IconButton
        active={dislikeActive}
        icon={faThumbsDown}
        onClick={onClickDislike}
      />
    </div>

  )
}

RatingButtons.propTypes = {
  onClickLike    : PropTypes.func,
  onClickDislike : PropTypes.func,
  likeActive     : PropTypes.bool,
  dislikeActive  : PropTypes.bool
}

export default RatingButtons
