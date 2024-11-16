import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom'
});

export function renderGallery(images) {
  const gallery = document.querySelector('.gallery');
  const markup = images.map(image => `
    <a href="${image.largeImageURL}" data-caption="${image.tags}" class="gallery-item">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" class="gallery-image" />
    </a>
  `).join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

export function clearGallery() {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
}
