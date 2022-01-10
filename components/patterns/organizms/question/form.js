import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Container } from 'reactstrap'
import { getCsrfToken, useSession } from 'next-auth/react'

import MyForm from '../../../patterns/molecules/form'
import { addMyQuestion } from '../../../../modules/lists'

const defaultInputs = [
  {
    name               : 'question-title',
    value              : '',
    label              : 'Question title:',
    type               : 'text',
    labelColumnOptions : {
      md: { size: 3 }
    },
    inputColumnOptions: {
      md: { size: 9 }
    }
  },
  {
    name               : 'question-content',
    value              : '',
    label              : 'Question details: ',
    type               : 'textarea',
    isRequired         : true,
    labelColumnOptions : {
      md: { size: 3 }
    },
    inputColumnOptions: {
      md: { size: 9 }
    }
  }
]

const QuestionForm = () => {
  const { status } = useSession()
  const dispatch = useDispatch()
  const [formState, setFormState] = useState(defaultInputs)

  const getFieldByName = (name) => {
    return formState.find(field => field.name === name)
  }

  const getToken = async () => {
    const csrfToken = await getCsrfToken()
    return csrfToken
  }

  const submitFunction = async () => {
    dispatch(addMyQuestion({
      title     : getFieldByName('question-title').value,
      content   : getFieldByName('question-content').value,
      csrfToken : await getToken()
    }))
  }

  return (
    <Container>
      {status === 'authenticated' && (
        <MyForm
          inputs={defaultInputs}
          formState={formState}
          setFormState={setFormState}
          submitFunction={submitFunction}
          heading='Ask a question'
        />
      )}
    </Container>
  )
}

export default QuestionForm
