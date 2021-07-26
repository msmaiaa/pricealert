import axios from 'axios'
import authHeader from './AuthHeader'

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
  email?: string
  username?: string
  _id?: string
}

interface ILoginRequestError {
  config: any
  data: {
    message: string
  }
  headers: any
  request: any
  status: number
  statusText: string
}

class AuthService {
  async login({ email, password }: ILoginFormParams):Promise<ILoginRequestResponse | ILoginRequestError | any> {
    try{
      const response = await axios.post(API_URL + '/login', { email, password })
      if(response.data.token || response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data))
        return response
      }
    }catch(error){
      return error.response
    }
  }

  logout() {
    localStorage.removeItem('user')
  }

  async register({ username, email, password}: IRegisterFormParams):Promise<any> {
    try{
      const response = await axios.post(API_URL + '/register', {
        username,
        email,
        password
      })
      return response
    }catch(error) {
      return error.response
    }
  }

  async updateUser(user: any): Promise<any> {
    try{
      const updated = await axios.put(API_URL + '/update', { user }, { headers: authHeader()})
      return updated
    }catch(error){
      console.error(error)
    }
  }
}

export default new AuthService()