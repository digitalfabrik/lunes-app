import axios from 'axios'

const baseURL = __DEV__ ? 'https://lunes-test.tuerantuer.org/api' : 'https://lunes.tuerantuer.org/api'

const instance = axios.create({
  baseURL: baseURL
})

export default instance
