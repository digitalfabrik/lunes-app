import axios from 'axios'

// const baseURL = 'https://lunes.tuerantuer.org/api'
const baseURL = 'https://lunes-test.tuerantuer.org/api'

const instance = axios.create({
  baseURL: baseURL
})

export default instance
