import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: 'http://221.226.81.54:30010', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10 * 60 * 1000 // request timeout,
})


export default service
