import axios from 'axios'

const API_URL: string = 'http://localhost:5000/auth/user'

export interface ILoginFormParams {
  email: string
  password: string
}

export interface IRegisterFormParams {
  email: string
  username: string
  password: string
}

interface ILoginRequestResponse {
  token?: string
  user?: {
    _id: string
  }
}

class AuthService {
  async login({ email, password }: ILoginFormParams) {
    return axios.post(API_URL + '/login', { email, password })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      return response.data
    })
  }

  logout() {
    localStorage.removeItem('user')
  }

  async register({ username, email, password}: IRegisterFormParams) {
    return axios.post(API_URL + 'register', {
      username,
      email,
      password
    })
  }
}

export default new AuthService()