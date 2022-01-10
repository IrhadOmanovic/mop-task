import classNames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'

import styles from './NavigationItem.module.scss'

const NavigationItem = ({
  className,
  text,
  onClick,
  hide
}) => {
  if (hide === true) {
    return false
  }

  return (
    <span
      onClick={() => onClick()}
      className={classNames(styles.navbarItem, 'mx-1', className)}
    >
      {text}
    </span>
  )
}

NavigationItem.propTypes = {
  className : PropTypes.string,
  text      : PropTypes.string,
  onClick   : PropTypes.func,
  hide      : PropTypes.bool
}

export default NavigationItem
