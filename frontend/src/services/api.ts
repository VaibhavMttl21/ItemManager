import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Items API
export const getAllItems = async () => {
  const response = await api.get('/items')
  return response.data
}

export const getItemById = async (id: string) => {
  const response = await api.get(`/items/${id}`)
  return response.data
}

export const createItem = async (formData: FormData) => {
  const response = await api.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const sendEnquiry = async (itemId: string) => {
  const response = await api.post(`/items/${itemId}/enquire`)
  return response.data
}

export default api