import React, { useEffect, useState } from 'react'
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
      placeholder   : 'someting@your-domain.domain',
      'data-testid' : 'register-email'
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
      placeholder   : 'someting@your-domain.domain',
      'data-testid' : 'register-email-confirm'
    }
  },
  {
    name    : 'register-first-name',
    value   : '',
    label   : 'First name',
    type    : 'text',
    options : {
      'data-testid': 'register-first-name'
    }
  },
  {
    name    : 'register-last-name',
    value   : '',
    label   : 'Last name:',
    type    : 'text',
    options : {
      'data-testid': 'register-last-name'
    }
  },
  {
    name                 : 'register-password',
    nameOfConnectedField : 'register-password-confirm',
    checked              : false,
    label                : 'Password',
    type                 : 'password',
    isRequired           : true,
    value                : '',
    options              : {
      'data-testid': 'register-password'
    }
  },
  {
    name                 : 'register-password-confirm',
    nameOfConnectedField : 'register-password',
    checked              : false,
    label                : 'ReType password',
    type                 : 'password',
    isRequired           : true,
    value                : '',
    options              : {
      'data-testid': 'register-password-confirm'
    }
  }
]

const passwordErrorMessage = 'Password must be at least of 5 characters size!'

const Registration = () => {
  const errorMessage = useSelector(store => store.user?.message)
  const [formState, setFormState] = useState(defaultInputs)
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    if (formErrorMessage === passwordErrorMessage) {
      const timer = setTimeout(() => {
        setFormErrorMessage('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [formErrorMessage])

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
      setFormErrorMessage(passwordErrorMessage)
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
