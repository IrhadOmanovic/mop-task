import { getCsrfToken } from 'next-auth/react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Container } from 'reactstrap'
import MyForm from '../../components/patterns/molecules/form'
import { registerUser } from '../../modules/user'

const Registration = () => {
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

  const [formState, setFormState] = useState(defaultInputs)
  const dispatch = useDispatch()

  const getFieldByName = (name) => {
    return formState.find(field => field.name === name)
  }

  const getToken = async () => {
    const csrfToken = await getCsrfToken()
    return csrfToken
  }

  const sumbitFunction = async () => {
    dispatch(registerUser({
      firstName : getFieldByName('register-first-name').value,
      lastName  : getFieldByName('register-last-name').value,
      password  : getFieldByName('register-password').value,
      email     : getFieldByName('register-email').value,
      csrfToken : await getToken()
    }))
  }

  return (
    <Container>
      <MyForm
        formState={formState}
        setFormState={setFormState}
        submitFunction={sumbitFunction}
        heading='Registration'
      />
    </Container>
  )
}

export default Registration
