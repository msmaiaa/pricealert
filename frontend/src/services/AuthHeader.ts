
export default function authHeader() {
  const userInLocalStorage = localStorage.getItem('user')
  if(userInLocalStorage) {
    const user: any = JSON.parse(userInLocalStorage)
    return { 'x-access-token': user.token }
  }else{
    return {}
  }
}