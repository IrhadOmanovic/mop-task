import React from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'

import styles from './Header.module.scss'
import { Container } from 'reactstrap'
import { handleRouteOnClick } from '../../../lib/handleRouteOnClick'
import { signOut, useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'

const Header = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const userEmail = useSelector(state => state.user?.email)

  const renderLeftNav = () => {
    return (
      <div
        className={classNames(styles.navigationItem, styles.f1)}
      >
        <span className='me-4'>Hello {status === 'authenticated' ? (userEmail || session.user.email) : 'Guest'}</span>
        {status === 'authenticated' && <span onClick={(e) => handleRouteOnClick(e, '/twitterOverview', router)}>Notifications</span>}
      </div>
    )
  }

  const renderRightNav = () => {
    return (
      <>
        <div className={classNames(styles.navigationItem, 'me-auto d-flex')}>
          {status !== 'authenticated' && (
            <div
              className='me-3'
              onClick={(e) => handleRouteOnClick(e, '/login', router)}
            >
              Login
            </div>
          )}
          {status !== 'authenticated' && <div onClick={(e) => handleRouteOnClick(e, '/registration', router)}>Register</div>}
          {status === 'authenticated' && (
            <div onClick={(e) => {
              signOut()
            }}
            >
              Logout
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <div style={{ backgroundColor: 'gray' }}>
      <Container className={styles.navigation}>
        {renderLeftNav()}
        {renderRightNav()}
      </Container>
    </div>
  )
}

export default Header
