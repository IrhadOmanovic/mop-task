import classNames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'

import styles from './WithLink.module.scss'

const WithLink = ({ children, location, className }) => {
  return (
    <Link href={location}>
      <div className={classNames(className, styles.cursorPointer)}>
        {children}
      </div>
    </Link>
  )
}

WithLink.propTypes = {
  children  : PropTypes.any,
  location  : PropTypes.string,
  className : PropTypes.string
}

export default WithLink
