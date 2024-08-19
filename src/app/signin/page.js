"use client"
import Login from '../components/signin'
import { Provider } from 'react-redux'
import store from '../utils/store'

const page = () => {
  return (
    <Provider store={store}><Login></Login></Provider>
  )
}

export default page