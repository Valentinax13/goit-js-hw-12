import axios from 'axios';

const API_KEY = '47111557-92c37ade8bb97610ca7074a51';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1, perPage = 15) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: perPage,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch images');
  }

  return response.data;
}
