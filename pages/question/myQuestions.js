// import PropTypes from 'prop-types'
// import { useDispatch } from 'react-redux'
// import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'reactstrap'
import QuestionList from '../../components/containers/question/list'
import { fetchMyQuestionsLists } from '../../modules/lists'

const MyQuestions = () => {
  const {
    // data: session,
    status
  } = useSession()

  const dispatch = useDispatch()
  const signedUserQuestions = useSelector(state => state?.lists?.signedUserQuestions)
  const page = useSelector(state => state?.lists?.signedUserQuestionsPage)
  const perPage = useSelector(state => state?.lists?.signedUserQuestionsPerPage)

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
      <QuestionList headerTitle='Your question' onClick={onClick} perPage={perPage} questions={signedUserQuestions} />
    </Container>
  )
}

export default MyQuestions
