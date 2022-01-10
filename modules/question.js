import { reducerRegistry } from '@pimred/redux'
import axios from 'axios'

const SET_QUESTION = 'question/SET_QUESTION'
const POST_RESPONSE = 'question/POST_RESPONSE'
const DELETE_RESPONSE = 'question/DELETE_RESPONSE'
const UPDATE_CONTENT_RESPONSE = 'question/UPDATE_CONTENT_RESPONSE'
const CREATE_RESPONSE_RATING = 'question/CREATE_RESPONSE_RATING'
const UPDATE_RESPONSE_RATING = 'question/UPDATE_RESPONSE_RATING'
const DELETE_RESPONSE_RATING = 'question/DELETE_RESPONSE_RATING'
const UPDATE_QUESTION_RATING = 'question/UPDATE_QUESTION_RATING'
const DELETE_QUESTION_RATING = 'question/DELETE_QUESTION_RATING'
const CREATE_QUESTION_RATING = 'question/CREATE_QUESTION_RATING'
const FETCH_QUESTION_FOR_SIGNED_USER = 'question/FETCH_QUESTION_FOR_SIGNED_USER'

const initialState = {
  content               : '',
  createdAt             : '',
  title                 : '',
  responses             : [],
  ratings               : [],
  pending               : false,
  pendingQuestionRating : false
}

export const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_QUESTION:
      return {
        ...state,
        ...action.data
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
    case FETCH_QUESTION_FOR_SIGNED_USER + '_PENDING':
      return {
        ...state,
        pending: true
      }
    case FETCH_QUESTION_FOR_SIGNED_USER + '_FULFILLED':
      return {
        ...state,
        ...action.payload.data,
        pending: false
      }
    case CREATE_RESPONSE_RATING + '_PENDING':{
      const tmp = state.responses
      tmp[action.meta.indexResponse].pending = true
      return {
        ...state,
        responses: [
          ...tmp
        ]
      }
    }
    case CREATE_RESPONSE_RATING + '_FULFILLED':{
      const tmp = state.responses
      tmp[action.meta.indexResponse].pending = false

      let ratings
      if (!tmp?.[action.meta.indexResponse]?.ratings) {
        ratings = [action.payload.data]
      } else {
        ratings = [...tmp[action.meta.indexResponse].ratings, action.payload.data]
      }

      tmp[action.meta.indexResponse].ratings = ratings
      return {
        ...state,
        responses: [
          ...tmp
        ]
      }
    }
    case DELETE_RESPONSE_RATING + '_PENDING':{
      const tmp = state.responses
      tmp[action.meta.indexResponse].pending = true
      return {
        ...state,
        responses: [
          ...tmp
        ]
      }
    }
    case DELETE_RESPONSE_RATING + '_FULFILLED':{
      const tmp = state.responses
      tmp[action.meta.indexResponse].pending = false
      tmp[action.meta.indexResponse].ratings = tmp[action.meta.indexResponse].ratings.filter(rating => rating.id !== action.payload.data.id)
      return {
        ...state,
        responses: [
          ...tmp
        ]
      }
    }
    case UPDATE_RESPONSE_RATING + '_PENDING':{
      const tmp = state.responses
      tmp[action.meta.indexResponse].pending = true
      return {
        ...state,
        responses: [
          ...tmp
        ]
      }
    }
    case UPDATE_RESPONSE_RATING + '_FULFILLED':{
      const tmp = state.responses
      tmp[action.meta.indexResponse].pending = false
      tmp[action.meta.indexResponse].ratings[action.meta.indexRating] = action.payload.data
      return {
        ...state,
        responses: [
          ...tmp
        ]
      }
    }
    case CREATE_QUESTION_RATING + '_PENDING':{
      return {
        ...state,
        pendingQuestionRating: true
      }
    }
    case CREATE_QUESTION_RATING + '_FULFILLED':{
      return {
        ...state,
        ratings               : [...state.ratings, action.payload.data],
        pendingQuestionRating : false
      }
    }
    case DELETE_QUESTION_RATING + '_PENDING':{
      return {
        ...state,
        pendingQuestionRating: true
      }
    }
    case DELETE_QUESTION_RATING + '_FULFILLED':{
      const tmp = state.ratings.filter(rating => rating.id !== action.payload.data.id)
      return {
        ...state,
        ratings               : [...tmp],
        pendingQuestionRating : false
      }
    }
    case UPDATE_QUESTION_RATING + '_PENDING':{
      return {
        ...state,
        pendingQuestionRating: true
      }
    }
    case UPDATE_QUESTION_RATING + '_FULFILLED':{
      const tmp = state.ratings
      tmp[action.meta.indexRating] = action.payload.data
      return {
        ...state,
        ratings               : [...tmp],
        pendingQuestionRating : false
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

export const createResponseRating = ({
  rating,
  responseId,
  csrfToken,
  indexResponse
}) => dispatch => {
  return dispatch({
    type    : CREATE_RESPONSE_RATING,
    payload : axios.post('../api/rating', {
      rating     : rating,
      responseId : responseId,
      csrfToken  : csrfToken
    }),
    meta: {
      indexResponse
    }
  })
}

export const updateResponseRating = ({
  rating,
  ratingId,
  csrfToken,
  indexRating,
  indexResponse
}) => dispatch => {
  return dispatch({
    type    : UPDATE_RESPONSE_RATING,
    payload : axios.patch('../api/rating', {
      rating    : rating,
      ratingId  : ratingId,
      csrfToken : csrfToken
    }),
    meta: {
      indexRating,
      indexResponse
    }
  })
}

export const deleteResponseRating = ({
  ratingId,
  csrfToken,
  indexRating,
  indexResponse
}) => dispatch => {
  return dispatch({
    type    : DELETE_RESPONSE_RATING,
    payload : axios.delete('../api/rating', {
      data: {
        ratingId  : ratingId,
        csrfToken : csrfToken
      }
    }),
    meta: {
      indexRating,
      indexResponse
    }
  })
}

export const createQuestionRating = ({
  rating,
  questionId,
  csrfToken
}) => dispatch => {
  return dispatch({
    type    : CREATE_QUESTION_RATING,
    payload : axios.post('../api/rating', {
      rating     : rating,
      questionId : questionId,
      csrfToken  : csrfToken
    })
  })
}

export const updateQuestionRating = ({
  rating,
  ratingId,
  csrfToken,
  indexRating
}) => dispatch => {
  return dispatch({
    type    : UPDATE_QUESTION_RATING,
    payload : axios.patch('../api/rating', {
      rating    : rating,
      ratingId  : ratingId,
      csrfToken : csrfToken
    }),
    meta: {
      indexRating
    }
  })
}

export const deleteQuestionRating = ({
  ratingId,
  csrfToken
}) => dispatch => {
  return dispatch({
    type    : DELETE_QUESTION_RATING,
    payload : axios.delete('../api/rating', {
      data: {
        ratingId  : ratingId,
        csrfToken : csrfToken
      }
    })
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
