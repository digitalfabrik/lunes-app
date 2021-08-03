import axios from 'axios'


let baseURL: string

if (__DEV__) {
  baseURL = 'https://lunes-test.tuerantuer.org/api'
} else {
  baseURL = 'https://lunes.tuerantuer.org/api'
}

const instance = axios.create({
  baseURL: baseURL
})

export default instance
