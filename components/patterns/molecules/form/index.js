import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useState } from 'react'
import { Button, Col, Container, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap'

import styles from './MyForm.module.scss'

const MyForm = ({
  formOptions,
  formState,
  setFormState,
  submitFunction,
  heading,
  defaultEmptyFieldErrorText,
  defaultFieldDoesntMatchErrorText,
  defaultFileTooBigErrorText,
  defaultMainColumnOptions,
  formHeadingOptions,
  defaultLabelColumnOptions,
  defaultInputColumnOptions,
  buttonOptions,
  defaultButtonColumnOptions,
  buttonClassName
}) => {
  const [isErrorPresent, setIsErrorPresent] = useState(true)

  const renderButton = () => {
    return (
      <Row className='my-3'>
        <Col {...defaultButtonColumnOptions} className='text-center'>
          <Button
            onClick={async () => checkFields()}
            className={classNames(styles.myFormButton, 'py-3', buttonClassName)}
            type='submit'
            {...buttonOptions}
          >
            Submit
          </Button>
        </Col>
      </Row>
    )
  }

  const checkEmptyFields = (input, index) => {
    if (!input.isRequired) {
      return
    }
    const newState = [...formState]

    const booleanForCheckboxInput = input.type === 'checkbox' && !input.checked && input.isRequired
    const booleanForNonCheckboxInput = input.type !== 'checkbox' && (input.value === '' || input.value === false || input.value === undefined)

    if (booleanForCheckboxInput || booleanForNonCheckboxInput) {
      newState[index].invalid = true
      newState[index].errorMessage = newState[index].defaultErrorMessage || defaultEmptyFieldErrorText
      setFormState(newState)
    } else {
      if (newState[index].errorMessage === newState[index].defaultErrorMessage || newState[index].errorMessage === defaultEmptyFieldErrorText) {
        newState[index].invalid = false
      }
    }
  }

  const checkMatchingFields = (input, index) => {
    if (input.nameOfConnectedField) {
      const indexOfConnectedField = formState.findIndex(i => i.name === input.nameOfConnectedField)
      const connectedInputField = formState[indexOfConnectedField]
      const newState = [...formState]

      newState[index].errorMessage = ''
      newState[index].invalid = false

      if (connectedInputField.value !== input.value &&
        connectedInputField.nameOfConnectedField === input.name &&
        input.type === connectedInputField.type
      ) {
        newState[index].invalid = true
        const parentindex = index > indexOfConnectedField ? index : indexOfConnectedField

        // We want to display message like Email field does not match, or First Name field does not match.
        const nameOfParent = formState[parentindex].name
        newState[index].errorMessage = `${nameOfParent} ${defaultFieldDoesntMatchErrorText}`

        setFormState(newState)
      }
    }
  }

  const checkFields = () => {
    setIsErrorPresent(false)
    formState.forEach((input, index) => {
      input.defaultOnSubmit && input.defaultOnSubmit(index)
      checkMatchingFields(input, index)
      checkEmptyFields(input, index)
      if (input.invalid) {
        setIsErrorPresent(true)
      }
    })
  }

  const handleInputChange = async ({ index, input, e }) => {
    const newState = [...formState]

    if (input.indexOfConnectedField) {
      newState[input.indexOfConnectedField].invalid = false
    }
    newState[index].invalid = false
    formState[index].defaultOnChange && formState[index].defaultOnChange(e)

    if (input.type === 'file') {
      const attachments = []
      const fileNames = []
      let invalid = false
      Array.from(e.target.files).forEach(file => {
        if (input.maximumSize && file.size > input.maximumSize) {
          invalid = true
        }
        fileNames.push(file.name)
        const reader = new FileReader()
        reader.onloadend = () => {
          attachments.push({
            path     : reader.result,
            filename : file.name
          })
        }
        reader.readAsDataURL(file)
      })
      newState[index].invalid = invalid
      newState[index].errorMessage = defaultFileTooBigErrorText
      newState[index].attachments = attachments
      newState[index].fileNames = fileNames.join(', ')
    }

    if (input.type === 'checkbox') {
      newState[index].checked = e.target.checked
    } else if (input.type === 'select' && input.options?.multiple) {
      newState[index].value = Array.from(e.target.selectedOptions, option => option.value)
    } else {
      newState[index].value = e.target.value
    }
    setFormState(newState)
  }

  const mapInputToCorrespondingElement = (input, index) => {
    if (input.type === 'heading') {
      return (
        <Col key={index} {...defaultMainColumnOptions}>
          <h4>{input.value}</h4>
        </Col>
      )
    } else if (input.type === 'radioGroup') {
      return (
        <Col
          key={index}
          {...defaultMainColumnOptions}
          {...input.mainColumnOptions}
        >
          <Label>{input.label}</Label>
          {input.radioButtons.map((radioButton, radioButtonIndex) => {
            return (
              <div key={radioButtonIndex} className='ml-4 mb-1'>
                <Input
                  type='radio'
                  name={input.name}
                  value={radioButton.value}
                  invalid={input.invalid}
                  onChange={(e) => {
                    handleInputChange({ index, input, e })
                  }}
                />
                {radioButton.label}
                {radioButton.description && <FormText className='mt-0' color='muted'>{radioButton.description}</FormText>}
              </div>
            )
          })}
          {input.invalid && <div className={classNames(styles.invalidFeedback)}>{input.errorMessage}</div>}
        </Col>
      )
    } else if (input.type === 'select') {
      return (
        <Col
          key={index}
          {...defaultMainColumnOptions}
          {...input.mainColumnOptions}
        >
          <FormGroup style={input.style} row>
            <Label
              {...defaultLabelColumnOptions}
              {...input.labelColumnOptions}
            >
              {input.label}
            </Label>
            <Col
              {...defaultInputColumnOptions}
              {...input.inputColumnOptions}
            >
              <Input
                type={input.type}
                value={input.value}
                invalid={input.invalid}
                disabled={input.disabled}
                onPaste={(e) => {
                  if (input.nameOfConnectedField) {
                    e.preventDefault()
                  }
                }}
                onChange={(e) => {
                  handleInputChange({ index, input, e })
                }}
                {...input.options}
              >
                {input.selectOptions.map((option, optionIndex) => {
                  return (
                    <option key={optionIndex}>{option.selectValue}</option>
                  )
                })}
              </Input>
              {input.description && <FormText color='muted'>{input.description}</FormText>}
              {input.invalid && <div className={classNames(styles.invalidFeedback)}>{input.errorMessage}</div>}
            </Col>
          </FormGroup>
        </Col>
      )
    } else if (input.type === 'checkbox') {
      return (
        <Col
          key={index}
          {...defaultMainColumnOptions}
          {...input.mainColumnOptions}
        >
          <FormGroup
            className={classNames(styles.labelContainer, 'px-4')}
            style={input.style}
          >
            <Input
              type={input.type}
              checked={input.checked}
              invalid={input.invalid}
              disabled={input.disabled}
              onChange={(e) => handleInputChange({ index, input, e })}
              {...input.options}
            />
            <Label>{input.label}</Label>
            {input.invalid && <div className={classNames(styles.invalidFeedback)}>{input.errorMessage}</div>}
          </FormGroup>
        </Col>
      )
    } else {
      return (
        <Col
          key={index}
          {...defaultMainColumnOptions}
          {...input.mainColumnOptions}
        >
          <FormGroup style={input.style} row>
            <Label
              {...defaultLabelColumnOptions}
              {...input.labelColumnOptions}
            >
              {input.label}
            </Label>
            <Col
              {...defaultInputColumnOptions}
              {...input.inputColumnOptions}
            >
              {input.type !== 'label' && (
                <Input
                  type={input.type}
                  value={input.value}
                  invalid={input.invalid}
                  disabled={input.disabled}
                  onPaste={(e) => {
                    if (input.nameOfConnectedField) {
                      e.preventDefault()
                    }
                  }}
                  onChange={(e) => handleInputChange({ index, input, e })}
                  {...input.options}
                />
              )}
              {input.description && <FormText color='muted'>{input.description}</FormText>}
              {input.invalid && <div className={classNames(styles.invalidFeedback)}>{input.errorMessage}</div>}
            </Col>
          </FormGroup>
        </Col>
      )
    }
  }

  const renderInputs = () => {
    let currentFormGroupName = ''
    let formGroupElements = []
    // We use additional array to store all elements that are making one of the form groups
    // We skip render until we get last element of particular formGroup into array
    // Then we render whole array and next element

    return formState.map((input, index) => {
      if (input.formGroup) {
        if (currentFormGroupName === '') {
          currentFormGroupName = input.formGroup
          formGroupElements = []
          formGroupElements.push(mapInputToCorrespondingElement(input, index))

          if (index + 1 === formState.length) {
            return formGroupElements
          }
        } else if (currentFormGroupName !== input.formGroup) {
          const elementToReturn = (
            <FormGroup
              row
              key={`${currentFormGroupName}`}
              className='mt-4'
            >
              {formGroupElements}
            </FormGroup>
          )
          currentFormGroupName = input.formGroup
          formGroupElements = []
          formGroupElements.push(mapInputToCorrespondingElement(input, index))

          if (index + 1 === formState.length) {
            return [
              elementToReturn,
              <FormGroup
                row
                key={`${currentFormGroupName}`}
                className='mt-4'
              >
                {formGroupElements}
              </FormGroup>
            ]
          }
          return elementToReturn
        } else if (currentFormGroupName === input.formGroup) {
          formGroupElements.push(mapInputToCorrespondingElement(input, index))

          if (index + 1 === formState.length) {
            return (
              <FormGroup
                row
                key={`${index}-row`}
                className='mt-4'
              >
                {formGroupElements}
              </FormGroup>
            )
          }
        }
      } else {
        if (formGroupElements.length !== 0) {
          const elementsToReturn = [
            <FormGroup
              row
              key={`${currentFormGroupName}`}
              className='mt-4'
            >
              {formGroupElements}
            </FormGroup>,
            <FormGroup key={index} row>
              {mapInputToCorrespondingElement(input, index)}
            </FormGroup>
          ]
          formGroupElements = []
          return elementsToReturn
        } else {
          return (
            <FormGroup key={index} row>
              {mapInputToCorrespondingElement(input, index)}
            </FormGroup>
          )
        }
      }
      return null
    })
  }

  return (
    <Container>
      <>
        {heading && (
        <Row className='mt-5'>
          <Col {...formHeadingOptions} className='text-center'>
            <h2>{heading}</h2>
          </Col>
        </Row>
        )}
        <Form
          className='my-3'
          onSubmit={async (e) => {
            e.preventDefault()
            if (!isErrorPresent) {
              submitFunction()
            }
          }}
          {...formOptions}
        >
          {renderInputs()}
          {renderButton()}
        </Form>
      </>
    </Container>
  )
}

MyForm.propTypes = {
  formState                        : PropTypes.array.isRequired,
  setFormState                     : PropTypes.func.isRequired,
  formOptions                      : PropTypes.object,
  submitFunction                   : PropTypes.func,
  heading                          : PropTypes.string,
  defaultEmptyFieldErrorText       : PropTypes.string,
  defaultFieldDoesntMatchErrorText : PropTypes.string,
  defaultFileTooBigErrorText       : PropTypes.string,
  defaultMainColumnOptions         : PropTypes.object,
  formHeadingOptions               : PropTypes.object,
  defaultLabelColumnOptions        : PropTypes.object,
  defaultInputColumnOptions        : PropTypes.object,
  buttonOptions                    : PropTypes.object,
  defaultButtonColumnOptions       : PropTypes.object,
  buttonClassName                  : PropTypes.string
}

MyForm.defaultProps = {
  defaultEmptyFieldErrorText       : 'Please fill this field!',
  defaultFieldDoesntMatchErrorText : "Fields doesn't match!",
  defaultFileTooBigErrorText       : 'Fiile(s) is/are too big. Please upload smaller ones!',
  defaultMainColumnOptions         : {
    sm: { size: 6, offset: 3 }
  },
  formHeadingOptions: {
    sm: { size: 12 }
  },
  defaultLabelColumnOptions: {
    md: { size: 6, offset: 3 }
  },
  defaultInputColumnOptions: {
    md: { size: 6, offset: 3 }
  },
  defaultButtonColumnOptions: {
    md: { size: 12 }
  }
}

export default MyForm
