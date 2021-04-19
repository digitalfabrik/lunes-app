import axios from 'axios';

const baseURL = 'https://lunes.tuerantuer.org/api';

const instance = axios.create({
  baseURL: baseURL,
});

export default instance;
