import axios from 'axios'

const API_URL: string = 'http://localhost:5000/auth/user'

interface ILoginFormParams {
  email: string
  password: string
}

interface IRegisterFormParams {
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
    try{
      const axiosResponse = await axios.post(API_URL + '/login', { email, password })
      if (axiosResponse.data.token) {
        localStorage.setItem('user', JSON.stringify(axiosResponse.data))
      }
      return axiosResponse.data
    }catch(e) {
      return e
    }
  }

  logout() {
    localStorage.removeItem('user')
  }

  async register({ username, email, password}: IRegisterFormParams) {
    const response = await axios.post(API_URL + 'register', {
      username,
      email,
      password
    })
    return response
  }
}

export default new AuthService()