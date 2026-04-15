import axios from 'axios'

const TOKEN_KEY = 'ums_token'
const REFRESH_TOKEN_KEY = 'ums_refresh_token'

let onUnauthorized = null
let isRefreshing = false
let refreshSubscribers = []

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback)
}

const onRefreshed = (token) => {
  refreshSubscribers.map((callback) => callback(token))
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const {
      config,
      response: { status },
    } = error

    const originalRequest = config

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

        if (refreshToken) {
          try {
            const response = await axios.post(`${axiosInstance.defaults.baseURL}/api/auth/refresh-token`, {
              refreshToken,
            })

            const newToken = response?.data?.data?.accessToken

            if (newToken) {
              localStorage.setItem(TOKEN_KEY, newToken)
              isRefreshing = false
              onRefreshed(newToken)
              refreshSubscribers = []
              return axiosInstance(originalRequest)
            }
          } catch (refreshError) {
            isRefreshing = false
            if (onUnauthorized) onUnauthorized()
            return Promise.reject(refreshError)
          }
        } else {
          if (onUnauthorized) onUnauthorized()
        }
      } else {
        // Wait for refresh to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosInstance(originalRequest))
          })
        })
      }
    }

    return Promise.reject(error)
  },
)

export { TOKEN_KEY, REFRESH_TOKEN_KEY }
export default axiosInstance
