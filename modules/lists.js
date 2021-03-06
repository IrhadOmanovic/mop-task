import axios from 'axios'
import { reducerRegistry } from '@pimred/redux'

const FETCH_LISTS = 'lists/FETCH_LISTS'
const FETCH_MY_QUESTIONS_LISTS = 'lists/FETCH_MY_QUESTIONS_LISTS'
const SET_LIST = 'lists/SET_LIST'
const ADD_SIGNED_USER_QUESTION = 'lists/ADD_SIGNED_USER_QUESTION'

const initialState = {
  latestQuestions     : [],
  mostActiveUsers     : [],
  hotQuestions        : [],
  signedUserQuestions : [],

  latestQuestionsPage        : 0,
  latestQuestionsPerPage     : 20,
  signedUserQuestionsPage    : 0,
  signedUserQuestionsPerPage : 20,

  signedUserQuestionsPending: false
}

export const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LISTS + '_FULFILLED':
      return {
        ...state,
        latestQuestions        : [...state.latestQuestions, ...action.payload.data],
        latestQuestionsPage    : action.meta.page,
        latestQuestionsPerPage : action.meta.perPage
      }
    case FETCH_MY_QUESTIONS_LISTS + '_PENDING':
      return {
        ...state,
        signedUserQuestionsPending: true
      }
    case FETCH_MY_QUESTIONS_LISTS + '_FULFILLED':
      return {
        ...state,
        signedUserQuestions        : [...state.signedUserQuestions, ...action.payload.data],
        signedUserQuestionsPage    : action.meta.page,
        signedUserQuestionsPerPage : action.meta.perPage,
        signedUserQuestionsPending : false
      }
    case ADD_SIGNED_USER_QUESTION + '_FULFILLED':{
      return {
        ...state,
        signedUserQuestions: [...state.signedUserQuestions, action.payload.data]
      }
    }
    case SET_LIST:
      return {
        ...state,
        latestQuestions : [...action.data.latestQuestions],
        mostActiveUsers : [...action.data.mostActiveUsers],
        hotQuestions    : [...action.data.hotQuestions]
      }
    default:
      return state
  }
}

reducerRegistry.register('lists', listsReducer)

export const addMyQuestion = ({
  title,
  content,
  csrfToken
}) => dispatch => {
  return dispatch({
    type    : ADD_SIGNED_USER_QUESTION,
    payload : axios.post('../api/question', {
      title     : title,
      content   : content,
      csrfToken : csrfToken
    })
  })
}

export const fetchLists = ({
  page,
  perPage
}) => dispatch => {
  return dispatch({
    type    : FETCH_LISTS,
    payload : axios.get(`/api/question/list?page=${page}&perPage=${perPage}`),
    meta    : {
      page,
      perPage
    }
  })
}

export const fetchMyQuestionsLists = ({
  page,
  perPage
}) => dispatch => {
  return dispatch({
    type    : FETCH_MY_QUESTIONS_LISTS,
    payload : axios.get(`/api/question/list/myQuestions?page=${page}&perPage=${perPage}`),
    meta    : {
      page,
      perPage
    }
  })
}

export const setLists = (data) => {
  return {
    type : SET_LIST,
    data : data
  }
}
