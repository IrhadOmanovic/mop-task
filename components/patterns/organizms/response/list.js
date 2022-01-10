import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap'
import { getCsrfToken, useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'

import styles from './List.module.scss'
import { createResponseRating, deleteResponse, deleteResponseRating, updateContentResponse, updateResponseRating } from '../../../../modules/question'
import SpinnersContainer from '../../atoms/spinnersContainer'
import EditDeleteButtons from '../../molecules/editDeleteButtons'
import RatingButtons from '../../molecules/ratingButtons'
import MyForm from '../../molecules/form'

const defaultInputs = [
  {
    name               : 'answer-content',
    value              : '',
    type               : 'textarea',
    isRequired         : true,
    labelColumnOptions : {
      md: { size: 0 }
    },
    inputColumnOptions: {
      md: { size: 12 }
    }
  }
]

const ResponseList = ({
  responses
}) => {
  const dispatch = useDispatch()
  const { data: session, status } = useSession()

  const initialResponsesEditFormState = responses.map(response => {
    const tmp = JSON.parse(JSON.stringify(defaultInputs))
    tmp[0].name = response.id
    return {
      id     : response.id,
      show   : false,
      inputs : tmp
    }
  })

  const [responsesEditForm, setResponsesEditForm] = useState(initialResponsesEditFormState)

  const onEditClick = (index) => {
    const tmpState = responsesEditForm
    tmpState[index].show = true
    setResponsesEditForm([...tmpState])
  }

  const onDeleteClick = async (responseId) => {
    dispatch(deleteResponse({
      responseId : responseId,
      csrfToken  : await getCsrfToken()
    }))
  }

  const setResponsesState = ({ newState, index }) => {
    const tmpState = responsesEditForm
    tmpState[index].inputs = newState

    setResponsesEditForm([...tmpState])
  }

  const responseSubmitFunction = async ({ index, response }) => {
    const tmpState = responsesEditForm
    tmpState[index].show = false
    setResponsesEditForm([...tmpState])

    dispatch(updateContentResponse({
      responseId : response.id,
      csrfToken  : await getCsrfToken(),
      content    : responsesEditForm[index].inputs[0].value
    }))
  }

  const onClickRatingResponse = async ({ response, index, rating, currentUserRating, currentUserRatingindex }) => {
    if (!currentUserRating) {
      dispatch(createResponseRating({
        rating        : rating,
        responseId    : response.id,
        csrfToken     : await getCsrfToken(),
        indexResponse : index
      }))
    } else if (currentUserRating.rating === !rating) {
      dispatch(updateResponseRating({
        rating        : rating,
        ratingId      : currentUserRating.id,
        csrfToken     : await getCsrfToken(),
        indexResponse : index,
        indexRating   : currentUserRatingindex
      }))
    } else {
      dispatch(deleteResponseRating({
        ratingId      : currentUserRating.id,
        csrfToken     : await getCsrfToken(),
        indexResponse : index,
        indexRating   : currentUserRatingindex
      }))
    }
  }

  return responses.map((response, index) => {
    const hasFirstAndLastname = response?.author?.firstName && response?.author?.lastName
    const fullNameOrEmail = hasFirstAndLastname ? response?.author?.firstName + ' ' + response?.author?.lastName : response?.author?.email

    const likes = response.ratings?.filter(rating => rating.rating === true).length || 0
    const dislikes = response.ratings?.length ? response.ratings?.length - likes : 0

    const currentUserRating = response.ratings?.find(rating => rating.authorId === session.user.id)
    const currentUserRatingindex = response.ratings?.findIndex(rating => rating.authorId === session.user.id)

    return (
      <Card key={response.id} className={classNames('my-3', styles.pointer)}>
        <CardBody>
          <CardTitle className={styles.cardTitle}>{`Responded by: ${fullNameOrEmail}`}</CardTitle>
          <CardSubtitle className={styles.cardSubtitle}>{`Responded at: ${response.createdAt}`}</CardSubtitle>
          <CardText>{response.content}</CardText>
          <SpinnersContainer />
          <div className='d-flex'>
            <EditDeleteButtons
              onDeleteClick={() => onDeleteClick(response.id)}
              onEditClick={() => onEditClick(index)}
              show={session?.user?.email === response?.author?.email && !responsesEditForm?.[index]?.show}
            />
            <RatingButtons
              likeActive={currentUserRating?.rating === true}
              onClickLike={() => {
                onClickRatingResponse({
                  rating                 : true,
                  index                  : index,
                  response               : response,
                  currentUserRating      : currentUserRating,
                  currentUserRatingindex : currentUserRatingindex
                })
              }}
              onClickDislike={() => {
                onClickRatingResponse({
                  rating                 : false,
                  index                  : index,
                  response               : response,
                  currentUserRating      : currentUserRating,
                  currentUserRatingindex : currentUserRatingindex
                })
              }}
              dislikeActive={currentUserRating?.rating === false}
              likesCount={likes}
              dislikesCount={dislikes}
              pending={response.pending}
              show={status === 'authenticated'}
            />
          </div>
          {responsesEditForm?.[index]?.show && (
          <MyForm
            formState={responsesEditForm[index].inputs}
            setFormState={(newState) => setResponsesState({ newState: newState, index: index })}
            submitFunction={() => responseSubmitFunction({ response: response, index: index })}
            heading='Enter new text'
          />
          )}
        </CardBody>
      </Card>
    )
  })
}

ResponseList.propTypes = {
  responses: PropTypes.array
}

export default ResponseList
