import api from './api'

export const loginUser = async (credentials) => {
    
    const response = await api.post('/auth/login', credentials)
    return response.data
}

export const registerUser = async (credentials) => {
    
    const response = await api.post('/auth/register', credentials)
    return response.data
}

export const isVerified = async (token) => {
    const response = await api.get(`/auth/verify/${token}`)
    return response.data
}