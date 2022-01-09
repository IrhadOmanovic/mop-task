import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Container, Spinner } from 'reactstrap'
import { getCsrfToken, useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { reduxWrapper } from '@pimred/redux'

import MyForm from '../../components/patterns/molecules/form'
import styles from './Question.module.scss'
import RatingButtons from '../../components/patterns/molecules/ratingButtons'
import SocketContext from '../../components/contexts/socketContext'
import { getQuestion } from '../../app/dao/question'
import {
  deleteResponse,
  postResponse,
  setQuestion,
  updateContentResponse,
  fetchQuestionForSignedUser,
  createResponseRating,
  updateResponseRating,
  deleteResponseRating,
  createQuestionRating,
  updateQuestionRating,
  deleteQuestionRating
} from '../../modules/question'

export const getServerSideProps = reduxWrapper.getServerSideProps(store => async ({ query }) => {
  const data = await getQuestion(parseInt(query.id))

  await store.dispatch(setQuestion(data))
  return {
    props: {}
  }
})

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

const QuestionDetail = () => {
  const responses = useSelector(store => store.question?.responses)
  const ratings = useSelector(store => store.question?.ratings)
  const question = useSelector(store => store.question)
  const pending = useSelector(store => store.question.pending)
  const pendingQuestionRating = useSelector(store => store.question.pendingQuestionRating)

  const socket = useContext(SocketContext)
  const { data: session, status } = useSession()
  const dispatch = useDispatch()

  const initialResponsesEditFormState = responses.map(response => {
    const tmp = JSON.parse(JSON.stringify(defaultInputs))
    tmp[0].name = response.id
    return {
      id     : response.id,
      show   : false,
      inputs : tmp
    }
  })

  const [formState, setFormState] = useState(defaultInputs)
  const [responsesEditForm, setResponsesEditForm] = useState(initialResponsesEditFormState)
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  const likes = ratings?.filter(rating => rating.rating === true).length || 0
  const dislikes = ratings?.length ? ratings?.length - likes : 0

  const currentUserRating = ratings?.find(rating => rating.authorId === session.user.id)
  const currentUserRatingindex = ratings?.findIndex(rating => rating.authorId === session.user.id)

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch(fetchQuestionForSignedUser({ questionId: question.id }))
    }
  }, [status])

  useEffect(() => {
    const temp = responses.map((response, index) => {
      const tmp = JSON.parse(JSON.stringify(defaultInputs))
      tmp[0].name = response.id
      return {
        id     : response.id,
        show   : responsesEditForm[index]?.show || false,
        inputs : tmp
      }
    })
    setResponsesEditForm(temp)
  }, [responses])

  const getFieldByName = (name) => {
    return formState.find(field => field.name === name)
  }

  const submitFunction = async () => {
    dispatch(postResponse({
      content    : getFieldByName('answer-content').value,
      questionId : question.id,
      csrfToken  : await getCsrfToken()
    })).then(res => {
      if (res?.action?.payload?.data?.id) {
        socket.emit('sendNotification', {
          senderId   : session.user.id,
          recieverId : question.authorId,
          type       : 'response'
        })
      }
    })
  }

  const onClickRatingResponse = async ({ rating }) => {
    if (!currentUserRating) {
      dispatch(createQuestionRating({
        rating     : rating,
        questionId : question.id,
        csrfToken  : await getCsrfToken()
      }))
    } else if (currentUserRating.rating === !rating) {
      dispatch(updateQuestionRating({
        rating      : rating,
        ratingId    : currentUserRating.id,
        csrfToken   : await getCsrfToken(),
        indexRating : currentUserRatingindex
      }))
    } else {
      dispatch(deleteQuestionRating({
        ratingId  : currentUserRating.id,
        csrfToken : await getCsrfToken()
      }))
    }
  }

  const onClickLike = () => {
    onClickRatingResponse({
      rating: true
    })
  }

  const onClickDislike = async () => {
    onClickRatingResponse({
      rating: false
    })
  }

  const renderLoadingSpinnersIndicators = () => {
    if (status === 'loading') {
      return (
        <div className='my-2 clearfix'>
          <div className='float-start'><Spinner /></div>
          <div className='float-end'><Spinner /></div>
        </div>
      )
    }
    return null
  }

  const renderQuestionBody = () => {
    return (
      <>
        <h1>{question.title}</h1>
        <span className='text-secondary'>
          {`Date of creation: ${dayjs(question.createdAt).format('DD-MM-YYYY hh:mm:ss')}`}
        </span>
        <p className='mt-3'>{question.content}</p>
        {status === 'authenticated' && (
          <div className={styles.buttonContainer}>
            {!showQuestionForm && (
              <Button onClick={() => setShowQuestionForm(true)}>
                Post an answer
              </Button>
            )}
            {!pendingQuestionRating && (
            <RatingButtons
              likeActive={currentUserRating?.rating === true}
              onClickLike={onClickLike}
              onClickDislike={onClickDislike}
              dislikeActive={currentUserRating?.rating === false}
              likesCount={likes}
              dislikesCount={dislikes}
            />
            )}
            {pendingQuestionRating && <div className='ms-auto'><Spinner /></div>}
          </div>
        )}
        {renderLoadingSpinnersIndicators()}
      </>
    )
  }

  const onDelete = async (responseId) => {
    dispatch(deleteResponse({
      responseId : responseId,
      csrfToken  : await getCsrfToken()
    }))
  }

  const renderEditDeleteButtons = (responseId, index) => {
    if (status !== 'authenticated') {
      return null
    }

    return (
      <div>
        <Button
          onClick={() => {
            const tmpState = responsesEditForm
            tmpState[index].show = true
            setResponsesEditForm([...tmpState])
          }}
          className='mx-1 px-3'
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(responseId)}
          className='mx-1 px-3'
        >
          Delete
        </Button>
      </div>
    )
  }

  const renderResponses = () => {
    return responses.map((response, index) => {
      const hasFirstAndLastname = response?.author?.firstName && response?.author?.lastName
      const fullNameOrEmail = hasFirstAndLastname ? response?.author?.firstName + ' ' + response?.author?.lastName : response?.author?.email

      const likes = response.ratings?.filter(rating => rating.rating === true).length || 0
      const dislikes = response.ratings?.length ? response.ratings?.length - likes : 0

      const currentUserRating = response.ratings?.find(rating => rating.authorId === session.user.id)
      const currentUserRatingindex = response.ratings?.findIndex(rating => rating.authorId === session.user.id)

      const setResponsesState = (newState) => {
        const tmpState = responsesEditForm
        tmpState[index].inputs = newState

        setResponsesEditForm([...tmpState])
      }

      const responseSubmitFunction = async () => {
        const tmpState = responsesEditForm
        tmpState[index].show = false
        setResponsesEditForm([...tmpState])

        dispatch(updateContentResponse({
          responseId : response.id,
          csrfToken  : await getCsrfToken(),
          content    : responsesEditForm[index].inputs[0].value
        }))
      }

      const onClickRatingResponse = async ({ rating }) => {
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

      const onClickLikeResponse = () => {
        onClickRatingResponse({
          rating: true
        })
      }

      const onClickDislikeResponse = async () => {
        onClickRatingResponse({
          rating: false
        })
      }

      return (
        <Card key={response.id} className={classNames('my-3', styles.pointer)}>
          <CardBody>
            <CardTitle className={styles.cardTitle}>{`Responded by: ${fullNameOrEmail}`}</CardTitle>
            <CardSubtitle className={styles.cardSubtitle}>{`Responded at: ${response.createdAt}`}</CardSubtitle>
            <CardText>{response.content}</CardText>
            {renderLoadingSpinnersIndicators()}
            <div className='d-flex'>
              {session?.user?.email === response?.author?.email && !responsesEditForm?.[index]?.show && renderEditDeleteButtons(response.id, index)}
              {status === 'authenticated' && !response.pending && (
              <RatingButtons
                likeActive={currentUserRating?.rating === true}
                onClickLike={onClickLikeResponse}
                onClickDislike={onClickDislikeResponse}
                dislikeActive={currentUserRating?.rating === false}
                likesCount={likes}
                dislikesCount={dislikes}
              />
              )}
              {response.pending && <div className='ms-auto'><Spinner /></div>}
            </div>
            {responsesEditForm?.[index]?.show && (
              <MyForm
                formState={responsesEditForm[index].inputs}
                setFormState={setResponsesState}
                submitFunction={responseSubmitFunction}
                heading='Enter new text'
              />
            )}
          </CardBody>
        </Card>
      )
    })
  }

  if (pending) {
    return (
      <Container className='py-5'>
        <div className='text-center'><Spinner /></div>
      </Container>
    )
  }

  return (
    <Container className='py-5'>

      {renderQuestionBody()}
      {showQuestionForm && (
        <MyForm
          formState={formState}
          setFormState={setFormState}
          submitFunction={submitFunction}
          heading='Post your answer'
        />
      )}
      {renderResponses()}
    </Container>
  )
}

export default QuestionDetail
