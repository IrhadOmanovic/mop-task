import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader, CardText, CardTitle } from 'reactstrap'
import classNames from 'classnames'

import styles from './ListCard.module.scss'

const ListCard = ({
  headerTitle,
  bodyTitle,
  bodyText,
  bodyFootnote,
  footerText
}) => {
  return (
    <Card className={classNames('my-3')}>
      <CardHeader>
        <CardTitle>{headerTitle}</CardTitle>
      </CardHeader>
      <CardBody>
        <CardTitle className={styles.cardTitle}>{bodyTitle}</CardTitle>
        <CardText>{bodyText}</CardText>
        <CardText className={styles.cardSubtitle}>{bodyFootnote}</CardText>
      </CardBody>
      {footerText && <CardFooter>{footerText}</CardFooter>}
    </Card>
  )
}

ListCard.propTypes = {
  headerTitle  : PropTypes.string,
  bodyTitle    : PropTypes.string,
  bodyText     : PropTypes.string,
  bodyFootnote : PropTypes.string,
  footerText   : PropTypes.string
}

export default ListCard
