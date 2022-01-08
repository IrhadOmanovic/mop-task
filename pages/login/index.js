// import PropTypes from 'prop-types'
// import { useDispatch } from 'react-redux'
// import { useRouter } from 'next/router'
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

  const [formState, setFormState] = useState(defaultInputs)
  const submitFunction = () => {
    signIn('credentials',
      {
        email       : getFieldByName('login-email').value,
        password    : getFieldByName('login-password').value,
        callbackUrl : '/'
      }
    )
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
    </Container>
  )
}

export default Login
