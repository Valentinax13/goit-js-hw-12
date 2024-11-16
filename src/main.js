import { fetchImages } from './js/pixabay-api';
import { renderGallery, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.search-form');
const loaderContainer = document.querySelector('.loader-container');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');
let query = '';
let page = 1;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  query = form.elements.query.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query',
    });
    return;
  }

  clearGallery();
  page = 1;
  showLoader();
  loadMoreBtn.style.display = 'none';

  try {
    const response = await fetchImages(query, page);
    hideLoader();
    const images = response.hits; 
    console.log(images); 
    if (Array.isArray(images) && images.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    if (Array.isArray(images)) {
      renderGallery(images);
      loadMoreBtn.style.display = 'block';
    } else {
      console.error('Expected an array but got:', images);
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: error.message,
    });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const response = await fetchImages(query, page);
    hideLoader();
    const images = response.hits; 
    console.log(images); 
    if (Array.isArray(images) && images.length === 0) {
      iziToast.error({
        title: 'Error',
        message: "We're sorry, but you've reached the end of search results.",
      });
      loadMoreBtn.style.display = 'none';
      return;
    }

    if (Array.isArray(images)) {
      renderGallery(images);
      smoothScroll(); 
    } else {
      console.error('Expected an array but got:', images);
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: error.message,
    });
  }
});

function showLoader() {
  loader.style.display = 'block';
  loaderContainer.style.display = 'flex';
}

function hideLoader() {
  loader.style.display = 'none';
  loaderContainer.style.display = 'none';
}

function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');
  if (galleryItem) {
    const { height: cardHeight } = galleryItem.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } else {
    console.error('Gallery item not found');
  }
}
