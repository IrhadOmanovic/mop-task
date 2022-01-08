import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './IconButton.module.scss'

const IconButton = ({
  active,
  icon,
  onClick
}) => {
  return (
    <Button
      className={classNames('me-2', styles.ratingButton, {
        [`${styles.active}`]: active
      })}
      onClick={() => onClick()}
    >
      <span>
        <FontAwesomeIcon icon={icon} />
      </span>
    </Button>

  )
}

IconButton.propTypes = {
  active  : PropTypes.bool,
  icon    : PropTypes.any,
  onClick : PropTypes.func
}

export default IconButton
