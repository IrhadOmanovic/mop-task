import React, { useState } from 'react'
import { getCsrfToken } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'reactstrap'

import MyForm from '../../components/patterns/molecules/form'
import { registerUser } from '../../modules/user'

const defaultInputs = [

  {
    name                 : 'register-email',
    nameOfConnectedField : 'register-email-confirm',
    value                : '',
    label                : 'Email',
    type                 : 'email',
    isRequired           : true,
    description          : 'Your email',
    options              : {
      placeholder: 'someting@your-domain.domain'
    }
  },
  {
    name                 : 'register-email-confirm',
    nameOfConnectedField : 'register-email',
    value                : '',
    label                : 'Email',
    type                 : 'email',
    isRequired           : true,
    description          : 'Your email',
    options              : {
      placeholder: 'someting@your-domain.domain'
    }
  },
  {
    name  : 'register-first-name',
    value : '',
    label : 'First name',
    type  : 'text'
  },
  {
    name  : 'register-last-name',
    value : '',
    label : 'Last name:',
    type  : 'text'
  },
  {
    name       : 'register-password',
    checked    : false,
    label      : 'Password',
    type       : 'password',
    isRequired : true,
    value      : ''

  }
]

const Registration = () => {
  const errorMessage = useSelector(store => store.user?.message)
  const [formState, setFormState] = useState(defaultInputs)
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const dispatch = useDispatch()
  const router = useRouter()

  const getFieldByName = (name) => {
    return formState.find(field => field.name === name)
  }

  const getToken = async () => {
    const csrfToken = await getCsrfToken()
    return csrfToken
  }

  const sumbitFunction = async () => {
    const passwordFieldValue = getFieldByName('register-password').value

    if (passwordFieldValue.length < 5) {
      setFormErrorMessage('Password must be at least of 5 characters size!')
      return
    }

    dispatch(registerUser({
      firstName : getFieldByName('register-first-name').value,
      lastName  : getFieldByName('register-last-name').value,
      password  : passwordFieldValue,
      email     : getFieldByName('register-email').value,
      csrfToken : await getToken()
    })).then(res => {
      if (!(res.action?.payload?.data?.error === true)) {
        router.push('/')
      }
    })
    setFormErrorMessage('')
  }

  return (
    <Container>
      <MyForm
        formState={formState}
        setFormState={setFormState}
        submitFunction={sumbitFunction}
        heading='Registration'
      />
      {(errorMessage !== '' || formErrorMessage !== '') && <div className='text-center text-danger mb-3'>{formErrorMessage || errorMessage}</div>}
    </Container>
  )
}

export default Registration
