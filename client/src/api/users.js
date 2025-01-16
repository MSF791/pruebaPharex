import axios from "axios";

const user = axios.create({
    baseURL:"http://localhost:8000/users",
})

export const LoginUser = (data) => user.post('/login', data)

export const RegisterUser = (data) => user.post('', data)

export const GetUsers = () => user.get('')

export const CheckAuth = (token) => user.post('/auth', { token })