import { reducerRegistry } from '@pimred/redux'
import axios from 'axios'

const LOGIN_USER = 'user/LOGIN_USER'
const REGISTER_USER = 'user/REGISTER_USER'
const FETCH_LOGGED_USER = 'user/FETCH_LOGGED_USER_USER'
const UPDATE_LOGGED_USER = 'user/UPDATE_LOGGED_USER'
const UPDATE_USER_PASSWORD = 'user/UPDATE_USER_PASSWORD'

const initialState = {
  message : '',
  error   : false,
  pending : false
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER + '_FULFILLED':
      return {
        ...state,
        error: action.payload.data?.error
      }
    case REGISTER_USER + '_FULFILLED':
      return {
        ...state,
        message : action.payload.data?.message,
        error   : action.payload.data?.error
      }
    case FETCH_LOGGED_USER + '_PENDING':
      return {
        ...state,
        pending: true
      }
    case FETCH_LOGGED_USER + '_FULFILLED':
      return {
        ...state,
        pending: false,
        ...action.payload.data
      }
    case UPDATE_LOGGED_USER + '_FULFILLED':
      return {
        ...state,
        message : '',
        error   : false,
        ...action.payload.data
      }
    case UPDATE_USER_PASSWORD + '_FULFILLED':
      return {
        ...state,
        ...action.payload.data
      }
    default:
      return state
  }
}

reducerRegistry.register('user', userReducer)

export const registerUser = ({ firstName, lastName, email, password, csrfToken }) => dispatch => {
  return dispatch({
    type    : REGISTER_USER,
    payload : axios.post('../api/register', {
      firstName : firstName,
      lastName  : lastName,
      password  : password,
      email     : email,
      csrfToken : csrfToken
    })
  })
}

export const fetchLoggedUserDetails = () => dispatch => {
  return dispatch({
    type    : FETCH_LOGGED_USER,
    payload : axios.get('../api/user')
  })
}

export const updateUser = ({
  email,
  firstName,
  lastName
}) => dispatch => {
  return dispatch({
    type    : UPDATE_LOGGED_USER,
    payload : axios.patch('../api/user', {
      email     : email,
      firstName : firstName,
      lastName  : lastName
    })
  })
}

export const updateUserPassword = ({
  password,
  csrfToken
}) => dispatch => {
  return dispatch({
    type    : UPDATE_USER_PASSWORD,
    payload : axios.patch('../api/user/password', {
      password  : password,
      csrfToken : csrfToken
    })
  })
}
