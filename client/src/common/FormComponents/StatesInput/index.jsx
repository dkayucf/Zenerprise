import React, { useCallback, useState } from 'react'
import { TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import Autocomplete from '@mui/material/Autocomplete'
import makeStyles from '@mui/styles/makeStyles'
import { useIsFocusVisible } from '../../../hooks'
import StatesInputPaper from './StatesInputPaper'
import { filter, includes, whereAny, toLower } from 'ramda'

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
})

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const filterStates = (states, inputVal) =>
  filter(
    whereAny({
      label: (val) => includes(toLower(inputVal), toLower(val)),
    }),
    states
  )

export default function StateSelect() {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [autoSelect, setAutoSelect] = useState(false)
  const classes = useStyles()
  const { values, touched, errors, setFieldValue, setFieldTouched } =
    useFormikContext()
  const inputTouched = touched['state']
  const inputErrors = errors['state']
  const state = values['state']
  const hasErrors = inputErrors && inputErrors.length > 0

  const {
    isFocusVisible,
    // eslint-disable-next-line no-unused-vars
    onBlurVisible,
    ref: focusVisibleRef,
  } = useIsFocusVisible()

  const onChange = useCallback(
    (e, state) => {
      if (!state) {
        setOpen(true)
      }
      return setFieldValue('state', state)
    },
    [setFieldValue]
  )

  const onBlur = useCallback(() => {
    if (inputValue) {
      const filteredStates = filterStates(usStates, inputValue)
      if (filteredStates.length === 1) {
        setFieldValue('state', filteredStates[0], false)
      } else {
        setFieldValue('state.label', inputValue, false)
      }
    }
    return setFieldTouched('state', true, true)
  }, [inputValue, setFieldTouched, setFieldValue])

  const onInputChange = useCallback(
    (e, newInputValue) => setInputValue(newInputValue),
    []
  )

  const handleOpen = (e) => {
    if (e.target.value !== state?.label || !isFocusVisible(e)) {
      setOpen(true)
    }
  }

  return (
    <Autocomplete
      open={open}
      onOpen={handleOpen}
      onClose={() => setOpen(false)}
      id="state-select"
      name="state"
      value={state}
      selectOnFocus
      freeSolo
      autoSelect={autoSelect}
      onChange={onChange}
      onBlur={onBlur}
      options={usStates}
      PaperComponent={StatesInputPaper(setAutoSelect)}
      inputValue={inputValue}
      onInputChange={onInputChange}
      classes={{
        option: classes.option,
      }}
      autoHighlight
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, { value }) => option.value === value}
      renderOption={(option) => (
        <React.Fragment>
          {toTitleCase(option.label)} ({option.value})
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          ref={focusVisibleRef}
          {...params}
          error={inputTouched && hasErrors}
          label="State"
          name="state"
          placeholder="Choose a State"
          variant="outlined"
          margin="normal"
          helperText={inputTouched && inputErrors}
          required
          fullWidth
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password',
          }}
        />
      )}
    />
  )
}

const usStates = [
  { label: 'ALABAMA', value: 'AL' },
  { label: 'ALASKA', value: 'AK' },
  { label: 'AMERICAN SAMOA', value: 'AS' },
  { label: 'ARIZONA', value: 'AZ' },
  { label: 'ARKANSAS', value: 'AR' },
  { label: 'CALIFORNIA', value: 'CA' },
  { label: 'COLORADO', value: 'CO' },
  { label: 'CONNECTICUT', value: 'CT' },
  { label: 'DELAWARE', value: 'DE' },
  { label: 'DISTRICT OF COLUMBIA', value: 'DC' },
  { label: 'FEDERATED STATES OF MICRONESIA', value: 'FM' },
  { label: 'FLORIDA', value: 'FL' },
  { label: 'GEORGIA', value: 'GA' },
  { label: 'GUAM', value: 'GU' },
  { label: 'HAWAII', value: 'HI' },
  { label: 'IDAHO', value: 'ID' },
  { label: 'ILLINOIS', value: 'IL' },
  { label: 'INDIANA', value: 'IN' },
  { label: 'IOWA', value: 'IA' },
  { label: 'KANSAS', value: 'KS' },
  { label: 'KENTUCKY', value: 'KY' },
  { label: 'LOUISIANA', value: 'LA' },
  { label: 'MAINE', value: 'ME' },
  { label: 'MARSHALL ISLANDS', value: 'MH' },
  { label: 'MARYLAND', value: 'MD' },
  { label: 'MASSACHUSETTS', value: 'MA' },
  { label: 'MICHIGAN', value: 'MI' },
  { label: 'MINNESOTA', value: 'MN' },
  { label: 'MISSISSIPPI', value: 'MS' },
  { label: 'MISSOURI', value: 'MO' },
  { label: 'MONTANA', value: 'MT' },
  { label: 'NEBRASKA', value: 'NE' },
  { label: 'NEVADA', value: 'NV' },
  { label: 'NEW HAMPSHIRE', value: 'NH' },
  { label: 'NEW JERSEY', value: 'NJ' },
  { label: 'NEW MEXICO', value: 'NM' },
  { label: 'NEW YORK', value: 'NY' },
  { label: 'NORTH CAROLINA', value: 'NC' },
  { label: 'NORTH DAKOTA', value: 'ND' },
  { label: 'NORTHERN MARIANA ISLANDS', value: 'MP' },
  { label: 'OHIO', value: 'OH' },
  { label: 'OKLAHOMA', value: 'OK' },
  { label: 'OREGON', value: 'OR' },
  { label: 'PALAU', value: 'PW' },
  { label: 'PENNSYLVANIA', value: 'PA' },
  { label: 'PUERTO RICO', value: 'PR' },
  { label: 'RHODE ISLAND', value: 'RI' },
  { label: 'SOUTH CAROLINA', value: 'SC' },
  { label: 'SOUTH DAKOTA', value: 'SD' },
  { label: 'TENNESSEE', value: 'TN' },
  { label: 'TEXAS', value: 'TX' },
  { label: 'UTAH', value: 'UT' },
  { label: 'VERMONT', value: 'VT' },
  { label: 'VIRGIN ISLANDS', value: 'VI' },
  { label: 'VIRGINIA', value: 'VA' },
  { label: 'WASHINGTON', value: 'WA' },
  { label: 'WEST VIRGINIA', value: 'WV' },
  { label: 'WISCONSIN', value: 'WI' },
  { label: 'WYOMING', value: 'WY' },
]
