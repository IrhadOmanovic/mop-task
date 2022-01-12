import dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Spinner } from 'reactstrap'
import { getCsrfToken, useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { reduxWrapper } from '@pimred/redux'

import MyForm from '../../components/patterns/molecules/form'
import styles from './Question.module.scss'
import RatingButtons from '../../components/patterns/molecules/ratingButtons'
import { getQuestion } from '../../app/dao/question'
import {
  postResponse,
  setQuestion,
  fetchQuestionForSignedUser,
  createQuestionRating,
  updateQuestionRating,
  deleteQuestionRating
} from '../../modules/question'
import SpinnersContainer from '../../components/patterns/atoms/spinnersContainer'
import ResponseList from '../../components/patterns/organizms/response/list'
import SocketContext from '../../lib/contexts/socketContext'

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
          type       : 'response',
          questionId : question.id,
          email      : session.user.email
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
            <RatingButtons
              likeActive={currentUserRating?.rating === true}
              onClickLike={onClickLike}
              onClickDislike={onClickDislike}
              dislikeActive={currentUserRating?.rating === false}
              likesCount={likes}
              dislikesCount={dislikes}
              pending={pendingQuestionRating}
              show
            />
          </div>
        )}
        <SpinnersContainer />
      </>
    )
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
      {/* {renderResponses()} */}
      <ResponseList responses={responses} />
    </Container>
  )
}

export default QuestionDetail
