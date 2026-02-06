import api from './api'

export const getMyProfile = async () => {
    const response = await api.get('/profile/me')
    return response.data //esto retorna la data del fixer
}

export const updateMyProfile = async (formData) => {
    const response = await api.put('/profile/f-update', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    })
    return response.data
}