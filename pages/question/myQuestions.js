import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Spinner } from 'reactstrap'

import QuestionList from '../../components/containers/question/list'
import { fetchMyQuestionsLists } from '../../modules/lists'
import QuestionForm from '../../components/containers/question/form'

const MyQuestions = () => {
  const dispatch = useDispatch()
  const signedUserQuestions = useSelector(state => state?.lists?.signedUserQuestions)
  const signedUserQuestionsPending = useSelector(state => state?.lists?.signedUserQuestionsPending)

  const page = useSelector(state => state?.lists?.signedUserQuestionsPage)
  const perPage = useSelector(state => state?.lists?.signedUserQuestionsPerPage)
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch(fetchMyQuestionsLists({ page: page, perPage: perPage }))
    }
  }, [status])

  const onClick = () => {
    dispatch(fetchMyQuestionsLists({
      page    : page + 1,
      perPage : perPage
    }))
  }

  return (
    <Container>
      {status === 'loading' && <div className='text-center my-5'><Spinner /></div>}
      <QuestionForm />
      {signedUserQuestionsPending && <div className='text-center my-5'><Spinner /></div>}
      {signedUserQuestions.length !== 0 && (
        <QuestionList
          headerTitle='Your question'
          onClick={onClick}
          perPage={perPage}
          questions={signedUserQuestions}
        />
      )}
    </Container>
  )
}

export default MyQuestions
