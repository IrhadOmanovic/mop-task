import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './IconButton.module.scss'

const IconButton = ({
  active,
  icon,
  onClick,
  text
}) => {
  return (
    <Button
      className={classNames('me-2', styles.ratingButton, {
        [`${styles.active}`]: active
      })}
      onClick={() => onClick()}
    >
      <div>
        <FontAwesomeIcon className='me-2' icon={icon} />
        {text}
      </div>
    </Button>

  )
}

IconButton.propTypes = {
  active  : PropTypes.bool,
  icon    : PropTypes.any,
  onClick : PropTypes.func,
  text    : PropTypes.oneOf(['number', 'string'])
}

export default IconButton
