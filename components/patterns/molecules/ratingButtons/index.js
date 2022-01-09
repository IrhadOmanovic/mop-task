import PropTypes from 'prop-types'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

import IconButton from '../../atoms/iconButton'

const RatingButtons = ({
  onClickLike,
  onClickDislike,
  likeActive,
  dislikeActive,
  likesCount,
  dislikesCount
}) => {
  return (
    <div className='ms-auto'>
      <IconButton
        active={likeActive}
        icon={faThumbsUp}
        onClick={onClickLike}
        text={likesCount}
      />
      <IconButton
        active={dislikeActive}
        icon={faThumbsDown}
        onClick={onClickDislike}
        text={dislikesCount}
      />
    </div>

  )
}

RatingButtons.propTypes = {
  onClickLike    : PropTypes.func,
  onClickDislike : PropTypes.func,
  likeActive     : PropTypes.bool,
  dislikeActive  : PropTypes.bool,
  likesCount     : PropTypes.number,
  dislikesCount  : PropTypes.number
}

export default RatingButtons
