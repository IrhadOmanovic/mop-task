import React, { useContext, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'

import styles from './Header.module.scss'
import { Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { handleRouteOnClick } from '../../../lib/handleRouteOnClick'
import { signOut, useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import SocketContext from '../../contexts/socketContext'

const Header = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const userEmail = useSelector(state => state?.user?.email)
  const socket = useContext(SocketContext)
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (status === 'authenticated') {
      socket?.emit('newUser', { userId: session.user.id, email: session.user.email })
    }
  }, [status, socket])

  useEffect(() => {
    socket?.on('getNotifications', data => {
      setNotifications((prev) => [...prev, data])
    })
  }, [socket])

  const renderLeftNav = () => {
    const items = [
      {
        route     : '/user',
        className : classNames(styles.navbarItem),
        text      : `Hello ${status === 'authenticated' ? (userEmail || session.user.email) : 'Guest'}`,
        condition : true
      },
      {
        route     : '/',
        className : classNames(styles.navbarItem, 'mx-2'),
        text      : 'Home',
        condition : true
      },
      {
        route     : '/question/myQuestions',
        className : classNames(styles.navbarItem),
        text      : 'My questions',
        condition : status === 'authenticated'
      }
    ]
    return (
      <div
        className={classNames(styles.navigationItem, styles.f1)}
      >
        {items.map((item, index) => {
          if (!item.condition) return null
          return (
            <span
              onClick={(e) => handleRouteOnClick(e, item.route, router)}
              className={item.className}
              key={index}
            >
              {item.text}
            </span>
          )
        })}
      </div>
    )
  }

  const renderRightNav = () => {
    return (
      <>
        <div className={classNames(styles.navigationItem, 'me-auto d-flex')}>
          {status === 'authenticated' && (
          <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
            <DropdownToggle className={styles.notifications}>
              Notifications
            </DropdownToggle>
            <DropdownMenu>
              {notifications.map((notification, index) => {
                return <DropdownItem key={index}>Another Action</DropdownItem>
              })}
              {notifications.length === 0 && (
                <DropdownItem>No new notifications!</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          )}
          {status !== 'authenticated' && (
            <div
              className={classNames('me-3', styles.navbarItem)}
              onClick={(e) => handleRouteOnClick(e, '/login', router)}
            >
              Login
            </div>
          )}
          {status !== 'authenticated' && (
            <div
              className={styles.navbarItem}
              onClick={(e) => handleRouteOnClick(e, '/registration', router)}
            >
              Register
            </div>
          )}
          {status === 'authenticated' && (
            <div
              onClick={(e) => {
                signOut()
              }}
              className={styles.navbarItem}
            >
              Logout
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <Container className={styles.navigation}>
        {renderLeftNav()}
        {renderRightNav()}
      </Container>
    </div>
  )
}

export default Header
