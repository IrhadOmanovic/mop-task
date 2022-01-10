import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'

import ListCard from '../../atoms/listCard'

const UserList = ({
  users
}) => {
  const renderusersList = () => {
    return users.map(user => {
      const footerText = user?._count?.responses ? `Number of comments: ${user?._count?.responses}` : ''
      const userFullName = user.firstName + ' ' + user.lastName
      return (
        <ListCard
          key={user.id}
          headerTitle='User'
          bodyText={userFullName}
          bodyTitle={user.email}
          bodyFootnote={user.createdAt}
          footerText={footerText}
        />
      )
    })
  }

  return (
    <Container>
      {renderusersList()}
    </Container>
  )
}

UserList.propTypes = {
  users: PropTypes.array
}

export default UserList
