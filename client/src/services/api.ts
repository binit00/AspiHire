import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5000/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // centralized error handling
    return Promise.reject(err?.response?.data || err)
  },
)

export default api
