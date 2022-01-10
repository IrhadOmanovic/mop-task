import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'reactstrap'
import NavigationItem from '../../atoms/navigationitem'

import classNames from 'classnames'

const NavigationContainer = ({
  leftNavigationItems,
  rightNavigationitems
}) => {
  const renderNav = (className, items) => {
    return (
      <div className={classNames('px-2', className)}>
        {items.map((item, index) => {
          if (item.customElement) {
            return item.customElement(index)
          }
          return (
            <NavigationItem
              key={index}
              text={item.text}
              onClick={item.onClick}
              hide={item.hide}
            />
          )
        })}
      </div>
    )
  }

  return (
    <Container className='d-flex py-2'>
      {renderNav('', leftNavigationItems)}
      {renderNav('ms-auto d-flex', rightNavigationitems)}
    </Container>
  )
}

NavigationContainer.propTypes = {
  leftNavigationItems  : PropTypes.array,
  rightNavigationitems : PropTypes.array
}

export default NavigationContainer
