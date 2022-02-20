/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef } from 'react'
import Paper from '@mui/material/Paper'

const StatesInputPaper =
  (setAutoSelect) =>
  ({ children, ...other }) => {
    const paperRef = useRef()
    useEffect(() => {
      const numOptions = paperRef.current.querySelectorAll(
        'li[data-option-index]'
      ).length
      setAutoSelect(numOptions === 1)
    })
    return (
      <Paper {...other} ref={paperRef}>
        {children}
      </Paper>
    )
  }

export default StatesInputPaper
