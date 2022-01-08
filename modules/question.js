import { reducerRegistry } from '@pimred/redux'
import axios from 'axios'

const SET_QUESTION = 'question/SET_QUESTION'
const POST_RESPONSE = 'question/POST_RESPONSE'
const DELETE_RESPONSE = 'question/DELETE_RESPONSE'
const UPDATE_CONTENT_RESPONSE = 'question/UPDATE_CONTENT_RESPONSE'
const UPDATE_QUESTION_RATING = 'question/UPDATE_QUESTION_RATING'
const UPDATE_RESPONSE_RATING = 'question/UPDATE_RESPONSE_RATING'
const FETCH_QUESTION_RATING = 'question/FETCH_QUESTION_RATING'
const FETCH_QUESTION_FOR_SIGNED_USER = 'question/FETCH_QUESTION_FOR_SIGNED_USER'

const initialState = {
  content   : '',
  createdAt : '',
  title     : '',
  responses : [],
  ratings   : []
}

export const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_QUESTION:
      return {
        ...state,
        ...action.data
      }
    case FETCH_QUESTION_FOR_SIGNED_USER + '_FULFILLED':
      return {
        ...state,
        ...action.payload.data
      }

    case POST_RESPONSE + '_FULFILLED':
      return {
        ...state,
        responses: [...state.responses, action.payload.data]
      }
    case DELETE_RESPONSE + '_FULFILLED': {
      const tmp = state.responses.filter(response => response.id !== action.meta.responseId)
      return {
        ...state,
        responses: [...tmp]
      }
    }
    case UPDATE_CONTENT_RESPONSE + '_FULFILLED': {
      const index = state.responses.findIndex(response => response.id === action.meta.responseId)
      const tmp = state.responses
      if (index !== -1) {
        tmp[index].content = action.meta.content
      }
      return {
        ...state,
        responses : [...tmp],
        test      : index
      }
    }
    case FETCH_QUESTION_RATING + '_FULFILLED':
      return {
        ...state,
        ratings : [...action.payload.data],
        test    : action.payload.data
      }

    case UPDATE_QUESTION_RATING + '_FULFILLED':
      return {
        ...state,
        ratings: [action.payload.data]
      }
    case UPDATE_RESPONSE_RATING + '_FULFILLED':{
      const tmp = state.responses
      if (action.meta.index) {
        tmp[action.meta.index].ratings = [action.payload.data]
      }
      return {
        ...state,
        responses: [...tmp]
      }
    }
    default:
      return state
  }
}

reducerRegistry.register('question', questionReducer)

export const setQuestion = (data) => {
  return {
    type : SET_QUESTION,
    data : data
  }
}

export const postResponse = ({
  content,
  questionId,
  csrfToken
}) => dispatch => {
  return dispatch({
    type    : POST_RESPONSE,
    payload : axios.post('../api/response', {
      content    : content,
      questionId : questionId,
      csrfToken  : csrfToken
    })
  })
}

export const deleteResponse = ({
  responseId,
  csrfToken
}) => dispatch => {
  return dispatch({
    type    : DELETE_RESPONSE,
    payload : axios.delete('../api/response', {
      data: {
        responseId : responseId,
        csrfToken  : csrfToken
      }
    }),
    meta: {
      responseId: responseId
    }
  })
}

export const updateContentResponse = ({
  responseId,
  csrfToken,
  content
}) => dispatch => {
  return dispatch({
    type    : UPDATE_CONTENT_RESPONSE,
    payload : axios.patch('../api/response', {
      content    : content,
      responseId : responseId,
      csrfToken  : csrfToken
    }),
    meta: {
      responseId : responseId,
      content    : content
    }
  })
}

export const fetchQuestionRating = ({
  questionId
}) => dispatch => {
  return dispatch({
    type    : FETCH_QUESTION_RATING,
    payload : axios.get(`../api/rating?questionId=${questionId}`)
  })
}

export const createOrUpdateQuestionRating = ({
  rating,
  ratingId,
  questionId
}) => dispatch => {
  return dispatch({
    type    : UPDATE_QUESTION_RATING,
    payload : axios.put('../api/rating', {
      rating     : rating,
      ratingId   : ratingId,
      questionId : questionId
    })
  })
}

export const createOrUpdateResponseRating = ({
  rating,
  ratingId,
  responseId,
  index
}) => dispatch => {
  return dispatch({
    type    : UPDATE_RESPONSE_RATING,
    payload : axios.put('../api/rating/response', {
      rating     : rating,
      ratingId   : ratingId,
      responseId : responseId
    }),
    meta: {
      index
    }
  })
}

export const fetchQuestionForSignedUser = ({
  questionId
}) => dispatch => {
  return dispatch({
    type    : FETCH_QUESTION_FOR_SIGNED_USER,
    payload : axios.get(`../api/question?questionId=${questionId}`)
  })
}
