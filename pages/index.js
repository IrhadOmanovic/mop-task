import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { reduxWrapper } from '@pimred/redux'
import { Container } from 'reactstrap'

import styles from '../styles/Home.module.scss'
import QuestionList from '../components/patterns/organizms/question/list'
import UserList from '../components/patterns/organizms/user/list'
import { getHotestQuestions, getLatestQuestions } from '../app/dao/question'
import { fetchLists, setLists } from '../modules/lists'
import { getMostActiveUsers } from '../app/dao/user'

export const getServerSideProps = reduxWrapper.getServerSideProps(store => async () => {
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
