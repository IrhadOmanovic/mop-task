// import PropTypes from 'prop-types'
import Head from 'next/head'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { reduxWrapper } from '@pimred/redux'
import { Container } from 'reactstrap'

import QuestionList from '../components/containers/question/list'
import styles from '../styles/Home.module.scss'
import { getHotestQuestions, getLatestQuestions } from '../app/dao/question'
import { fetchLists, setLists } from '../modules/lists'
import classNames from 'classnames'
import { getMostActiveUsers } from '../app/dao/user'
import UserList from '../components/containers/user/list'

export const getServerSideProps = reduxWrapper.getServerSideProps(store => async ({ query }) => {
  const latestQuestions = await getLatestQuestions()
  const mostActiveUsers = await getMostActiveUsers()
  const hotQuestions = await getHotestQuestions()

  const data = {
    latestQuestions : latestQuestions,
    mostActiveUsers : mostActiveUsers,
    hotQuestions    : hotQuestions
  }
  await store.dispatch(setLists(data))

  return {
    props: {
    }
  }
})

const Home = () => {
  const lists = useSelector(state => state.lists)
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const page = useSelector(state => state?.lists?.latestQuestionsPage)
  const perPage = useSelector(state => state?.lists?.latestQuestionsPerPage)

  const dispatch = useDispatch()

  const onClickNewestQuestions = () => {
    dispatch(fetchLists({
      page    : page + 1,
      perPage : perPage
    }))
  }

  const tabs = [
    {
      tabName : 'Most recent questions',
      content : <QuestionList onClick={onClickNewestQuestions} perPage={perPage} questions={lists.latestQuestions} />
    },
    {
      tabName : 'Most active users',
      content : <UserList users={lists.mostActiveUsers} />
    },
    {
      tabName : 'Hot questions',
      content : <QuestionList headerTitle='Hot questions' questions={lists.hotQuestions} />
    }

  ]

  const renderTabs = () => {
    return (
      <div className={classNames(styles.tabContainer)}>
        {tabs.map((tab, index) => {
          return (
            <div
              key={index}
              className={classNames(styles.tabElement, {
                [`${styles.active}`]: index === activeTabIndex
              })}
              onClick={() => setActiveTabIndex(index)}
            >
              {tab.tabName}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
        <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC' crossOrigin='anonymous' />
        <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js' integrity='sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM' crossOrigin='anonymous' />
      </Head>

      <Container className='py-5'>
        {renderTabs()}
        {tabs[activeTabIndex].content}
      </Container>
    </div>
  )
}

Home.propTypes = {
}

export default Home
