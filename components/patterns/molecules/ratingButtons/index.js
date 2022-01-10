import PropTypes from 'prop-types'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

import IconButton from '../../atoms/iconButton'
import { Spinner } from 'reactstrap'

const RatingButtons = ({
  onClickLike,
  onClickDislike,
  likeActive,
  dislikeActive,
  likesCount,
  dislikesCount,
  pending,
  show
}) => {
  if (!show) {
    return null
  }

  return (
    <div className='ms-auto'>
      {!(pending === true) && (
        <>
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
        </>
      )}
      {pending === true && <div className='ms-auto'><Spinner /></div>}
    </div>

  )
}

RatingButtons.propTypes = {
  onClickLike    : PropTypes.func,
  onClickDislike : PropTypes.func,
  likeActive     : PropTypes.bool,
  dislikeActive  : PropTypes.bool,
  likesCount     : PropTypes.number,
  dislikesCount  : PropTypes.number,
  pending        : PropTypes.bool,
  show           : PropTypes.bool
}

export default RatingButtons
