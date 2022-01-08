// import PropTypes from 'prop-types'
// import { useDispatch } from 'react-redux'
// import { useRouter } from 'next/router'
import classNames from 'classnames'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Container } from 'reactstrap'
import { getCsrfToken, useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { reduxWrapper } from '@pimred/redux'

import MyForm from '../../components/patterns/molecules/form'
import styles from './Question.module.scss'
import RatingButtons from '../../components/patterns/molecules/ratingButtons'
import { getQuestion } from '../../app/dao/question'
import { deleteResponse, fetchQuestionRating, postResponse, setQuestion, updateContentResponse, createOrUpdateQuestionRating, fetchQuestionForSignedUser, createOrUpdateResponseRating } from '../../modules/question'

export const getServerSideProps = reduxWrapper.getServerSideProps(store => async ({ query }) => {
  const data = await getQuestion(parseInt(query.id))

  await store.dispatch(setQuestion(data))
  return {
    props: {
      question: data
    }
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

const QuestionDetail = ({ question }) => {
  const responses = useSelector(store => store.question?.responses)
  const ratings = useSelector(store => store.question?.ratings)

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

  const { data: session, status } = useSession()
  const dispatch = useDispatch()

  useEffect(() => {
    if (status === 'authenticated') {
      // dispatch(fetchQuestionRating({ questionId: question.id }))
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
    }))
  }

  const onClickLike = () => {
    if (ratings?.[0]?.rating) {
      return null
    }
    dispatch(createOrUpdateQuestionRating({
      rating     : true,
      ratingId   : ratings?.[0]?.id,
      questionId : question.id
    }))
  }

  const onClickDislike = () => {
    if (ratings?.[0]?.rating === false) {
      return null
    }
    dispatch(createOrUpdateQuestionRating({
      rating     : false,
      ratingId   : ratings?.[0]?.id,
      questionId : question.id
    }))
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
              likeActive={ratings?.[0]?.rating}
              onClickLike={onClickLike}
              onClickDislike={onClickDislike}
              dislikeActive={ratings?.[0]?.rating === false}
            />
          </div>
        )}
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

      const onClickLikeResponse = () => {
        if (responses[index].ratings?.[0]?.rating) {
          return null
        }
        dispatch(createOrUpdateResponseRating({
          rating     : true,
          ratingId   : responses[index].ratings?.[0]?.id,
          responseId : responses[index].id,
          index      : index
        }))
      }

      const onClickDislikeResponse = () => {
        if (responses[index].ratings?.[0]?.rating === false) {
          return null
        }
        dispatch(createOrUpdateResponseRating({
          rating     : false,
          ratingId   : responses[index].ratings?.[0]?.id,
          responseId : responses[index].id,
          index      : index
        }))
      }

      return (
        <Card key={response.id} className={classNames('my-3', styles.pointer)}>
          <CardBody>
            <CardTitle className={styles.cardTitle}>{`Responded by: ${fullNameOrEmail}`}</CardTitle>
            <CardSubtitle className={styles.cardSubtitle}>{`Responded at: ${response.createdAt}`}</CardSubtitle>
            <CardText>{response.content}</CardText>
            <div className='d-flex'>
              {session?.user?.email === response?.author?.email && !responsesEditForm?.[index]?.show && renderEditDeleteButtons(response.id, index)}
              <RatingButtons
                likeActive={responses[index].ratings?.[0]?.rating}
                onClickLike={onClickLikeResponse}
                onClickDislike={onClickDislikeResponse}
                dislikeActive={responses[index].ratings?.[0]?.rating === false}
              />
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

QuestionDetail.propTypes = {
  question: PropTypes.object
}

export default QuestionDetail
