import React from 'react'
import PropTypes from 'prop-types'
import { Button, Container } from 'reactstrap'

import ListCard from '../../patterns/atoms/listCard'
import WithLink from '../../patterns/atoms/withLink'

const QuestionList = ({
  questions,
  dontShowButton,
  headerTitle,
  perPage,
  onClick
}) => {
  const renderShowMoreButton = () => {
    if (questions.length % perPage !== 0) {
      return null
    }
    if (dontShowButton) {
      return null
    }
    return (
      <div className='text-center mb-3'>
        <Button
          onClick={() => onClick()}
        >
          Show more
        </Button>
      </div>
    )
  }

  const renderQuestionList = () => {
    return questions.map(question => {
      const footerText = question?._count?.ratings ? `Number of positive ratings: ${question?._count?.ratings}` : ''
      return (
        <WithLink key={question.id} location={`/question/${question.id}`}>
          <ListCard
            headerTitle={headerTitle}
            bodyText={question.content}
            bodyTitle={question.title}
            bodyFootnote={question.createdAt}
            footerText={footerText}
          />
        </WithLink>
      )
    })
  }

  return (
    <Container>
      {renderQuestionList()}
      {renderShowMoreButton()}
    </Container>
  )
}

QuestionList.propTypes = {
  questions      : PropTypes.array,
  dontShowButton : PropTypes.bool,
  headerTitle    : PropTypes.string,
  perPage        : PropTypes.any,
  onClick        : PropTypes.func
}

QuestionList.defaultProps = {
  headerTitle: 'Questions'
}

export default QuestionList
