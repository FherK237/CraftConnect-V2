import api from "./api";

export const viwProfileFixer = async (id) => {
  const response = await api.get(`/user/public/${id}`)
  return response.data
}