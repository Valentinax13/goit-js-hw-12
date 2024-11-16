import { fetchImages } from './js/pixabay-api';
import { renderGallery, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const loaderContainer = document.querySelector('.loader-container');
const loader = document.querySelector('.loader');

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

  page = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await fetchImages(query, page);
    hideLoader();
    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    renderGallery(data.hits);
    showLoadMoreBtn();
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
    const data = await fetchImages(query, page);
    hideLoader();
    renderGallery(data.hits);

    if (page * 15 >= data.totalHits) {
      hideLoadMoreBtn();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    // Плавне прокручування сторінки
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
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

function showLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none';
}
