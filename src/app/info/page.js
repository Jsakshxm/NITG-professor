"use client"
import React from 'react'
import ProfessorForm from '../components/info'
import { Provider } from 'react-redux'
import store from '../utils/store'
const page = () => {
  return (
    <Provider store={store}><ProfessorForm /> </Provider>
  )
}

export default page