import axios from 'axios'

const devMode = true
const prefix = 'Vue/Faturamento/WebApi/'
let url = window.location.href

export const formatUrl = () => {
  url = url.split('/')
  url = `${url[0]}//${url[2]}/${prefix}`

  return devMode ? 'http://localhost:61190/' : url
}

const HTTP = axios.create({
  baseURL: formatUrl(),
  headers: {}
})

export default HTTP
