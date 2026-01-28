import api from './api'

export const getFixerProfile = async () => {
    const response = await api.get('/profile/fixer')
    return response.data //esto retorna la data del fixer
}

export const updateFixerProfile = async (formData) => {
    const response = await api.put('/profile/configure-fixer', formData)
    return response.data
}