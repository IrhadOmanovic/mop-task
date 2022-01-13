import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import { Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'

import styles from './Header.module.scss'
import NavigationContainer from '../../molecules/navigationContainer'
import WithLink from '../../atoms/withLink'
import SocketContext from '../../../../lib/contexts/socketContext'
import { handleRouteOnClick } from '../../../../lib/handleRouteOnClick'

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
      setNotifications([...data])
    })
  }, [socket])

  const deleteNotification = (indexNotification) => {
    const temp = notifications
    temp.splice(indexNotification, 1)
    setNotifications([...temp])
    socket?.emit('deleteNotification', { userId: session.user.id, indexNotification: indexNotification })
  }

  const leftNavItems = [
    {
      onClick : (e) => handleRouteOnClick(e, '/user', router),
      text    : `Hello ${status === 'authenticated' ? (userEmail || session.user.email) : 'Guest'}`
    },
    {
      onClick : (e) => handleRouteOnClick(e, '/', router),
      text    : 'Home'
    },
    {
      onClick : (e) => handleRouteOnClick(e, '/question/myQuestions', router),
      text    : 'My questions',
      hide    : status !== 'authenticated'
    }
  ]

  const renderNotificationsDropdown = (index) => {
    if (status !== 'authenticated') {
      return null
    }
    return (
      <Dropdown key={index} isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle className={styles.notifications}>
          Notifications
        </DropdownToggle>
        <DropdownMenu>
          {notifications.map((notification, index) => {
            return (
              <WithLink
                key={index}
                location={`/question/${notification.questionId}`}
              >
                <DropdownItem onClick={() => deleteNotification(index)} key={index}>
                  {`User ${notification.email} left you a response!`}
                </DropdownItem>
              </WithLink>
            )
          })}
          {notifications.length === 0 && (
          <DropdownItem>No new notifications!</DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    )
  }

  const rightNavItems = [
    {
      customElement: (index) => renderNotificationsDropdown(index)
    },
    {
      onClick : (e) => handleRouteOnClick(e, '/login', router),
      text    : 'Login',
      hide    : status === 'authenticated'
    },
    {
      onClick : (e) => handleRouteOnClick(e, '/registration', router),
      text    : 'Register',
      hide    : status === 'authenticated'
    },
    {
      onClick : (e) => signOut(),
      text    : 'Logout',
      hide    : status !== 'authenticated'
    }
  ]

  return (
    <div className={styles.container}>
      <Container className={styles.navigation}>
        <NavigationContainer leftNavigationItems={leftNavItems} rightNavigationitems={rightNavItems} />
      </Container>
    </div>
  )
}

export default Header
