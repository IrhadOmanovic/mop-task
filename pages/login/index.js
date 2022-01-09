import React, { useState } from 'react'
import { Container } from 'reactstrap'
import { signIn } from 'next-auth/react'

import MyForm from '../../components/patterns/molecules/form'

const Login = () => {
  const defaultInputs = [
    {
      name        : 'login-email',
      value       : '',
      label       : 'Email',
      type        : 'email',
      isRequired  : true,
      description : 'Your email',
      options     : {
        placeholder: 'someting@your-domain.domain'
      }
    },
    {
      name       : 'login-password',
      checked    : false,
      label      : 'Password',
      type       : 'password',
      isRequired : true,
      value      : ''

    }
  ]
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [formState, setFormState] = useState(defaultInputs)
  const submitFunction = () => {
    const passwordFieldValue = getFieldByName('login-password').value
    if (passwordFieldValue.length < 5) {
      setFormErrorMessage('Password must be at least of 5 characters size!')
      return
    }
    signIn('credentials',
      {
        email       : getFieldByName('login-email').value,
        password    : passwordFieldValue,
        callbackUrl : '/'
      }
    )
    setFormErrorMessage('')
  }

  const getFieldByName = (name) => {
    return formState.find(field => field.name === name)
  }

  return (
    <Container>
      <MyForm
        formState={formState}
        setFormState={setFormState}
        submitFunction={submitFunction}
        heading='Login'
      />
      {formErrorMessage !== '' && <div className='text-center text-danger mb-3'>{formErrorMessage}</div>}
    </Container>
  )
}

export default Login
