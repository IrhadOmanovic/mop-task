import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCsrfToken, useSession } from 'next-auth/react'
import { Button, Card, CardBody, CardGroup, CardHeader, CardText, Container, Spinner } from 'reactstrap'

import styles from './User.module.scss'
import { fetchLoggedUserDetails, updateUser, updateUserPassword } from '../../modules/user'
import MyForm from '../../components/patterns/molecules/form'

const generalInfoFormFields = [
  {
    name                 : 'user-email',
    nameOfConnectedField : 'user-email-confirm',
    value                : '',
    label                : 'Email',
    type                 : 'email',
    description          : 'Your email',
    options              : {
      placeholder: 'someting@your-domain.domain'
    }
  },
  {
    name                 : 'user-email-confirm',
    nameOfConnectedField : 'user-email',
    value                : '',
    label                : 'ReType Email',
    type                 : 'email',
    description          : 'Your email',
    options              : {
      placeholder: 'someting@your-domain.domain'
    }
  },
  {
    name  : 'user-first-name',
    value : '',
    label : 'First name',
    type  : 'text'
  },
  {
    name  : 'user-last-name',
    value : '',
    label : 'Last name:',
    type  : 'text'
  }
]

const passwordFormFields = [
  {
    name                 : 'user-password',
    nameOfConnectedField : 'user-password-confirm',
    value                : '',
    label                : 'Password',
    type                 : 'password',
    isRequired           : true,
    description          : 'New password'
  },
  {
    name                 : 'user-password-confirm',
    nameOfConnectedField : 'user-password',
    value                : '',
    label                : 'ReType password',
    type                 : 'password',
    isRequired           : true

  }
]

const MyProfile = () => {
  const dispatch = useDispatch()
  const { status } = useSession()

  const user = useSelector(state => state.user)
  const pending = useSelector(state => state?.user?.pending)
  const errorMessage = useSelector(state => state.user.message)
  const [activeForm, setActiveForm] = useState(0)
  const [generalInfoForm, setGeneralInfoForm] = useState(generalInfoFormFields)
  const [passwordForm, setPasswordForm] = useState(passwordFormFields)

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch(fetchLoggedUserDetails({}))
    }
  }, [status])

  const getFieldByName = (name, fields) => {
    return fields.find(field => field.name === name)
  }

  const generalInfoFormSubmit = () => {
    dispatch(updateUser({
      email     : getFieldByName('user-email', generalInfoForm).value,
      firstName : getFieldByName('user-first-name', generalInfoForm).value,
      lastName  : getFieldByName('user-last-name', generalInfoForm).value
    }))
  }

  const passwordFormSubmit = async () => {
    dispatch(updateUserPassword({
      password  : getFieldByName('user-password', passwordForm).value,
      csrfToken : await getCsrfToken()
    }))
  }

  const getGeneralInfoForm = () => {
    return (
      <MyForm
        formState={generalInfoForm}
        setFormState={setGeneralInfoForm}
        submitFunction={generalInfoFormSubmit}
        heading='Enter new data'
      />
    )
  }

  const getPasswordForm = () => {
    return (
      <MyForm
        formState={passwordForm}
        setFormState={setPasswordForm}
        submitFunction={passwordFormSubmit}
        heading='Enter new password'
      />
    )
  }

  const forms = [
    <div key='1'>
      {getGeneralInfoForm()}
      {errorMessage !== '' && <div className='text-center text-danger mb-3'>{errorMessage}</div>}
    </div>,
    <div key='2'>
      {getPasswordForm()}
    </div>
  ]

  const renderProfileDetails = () => {
    const fields = [
      {
        title : 'Email',
        text  : user.email
      },
      {
        title : 'First name',
        text  : user.firstName
      },
      {
        title : 'Last name',
        text  : user.lastName
      },
      {
        title : 'Created at',
        text  : user.createdAt
      }
    ]
    return (
      <Card className='my-5'>
        <CardHeader>
          Your information
        </CardHeader>
        <CardBody>
          {fields.map(field => {
            return (
              <CardGroup key={field.title} className={styles.cardGroup}>
                <CardText className={styles.title}>{field.title}</CardText>
                <CardText className={styles.text}>{field.text}</CardText>
              </CardGroup>
            )
          })}
          <CardGroup className='d-flex'>
            <div className='ms-auto'>
              <Button onClick={() => setActiveForm(0)} className='me-2'>Change information</Button>
              <Button onClick={() => setActiveForm(1)}>Change password</Button>
            </div>
          </CardGroup>
        </CardBody>
      </Card>
    )
  }

  return (
    <Container>
      {(pending || status === 'loading') && <div className='my-5 text-center'><Spinner /></div>}
      {user.email && renderProfileDetails()}
      {status === 'authenticated' && user.email && forms[activeForm]}
    </Container>
  )
}

export default MyProfile
