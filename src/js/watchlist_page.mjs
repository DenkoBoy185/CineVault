import { getWatchlist, removeFromWatchlist, toggleWatched } from './watchlist.mjs';
import { getImageUrl } from './api.mjs';
import { renderListWithTemplate } from './utils.mjs';

const grid = document.getElementById('watchlist-grid');
const btnAll = document.getElementById('filter-all');
const btnUnwatched = document.getElementById('filter-unwatched');
const btnWatched = document.getElementById('filter-watched');

let currentFilter = 'all'; // 'all', 'watched', 'unwatched'

function watchlistCardTemplate(movie) {
  const isMovie = movie.media_type === 'movie' || !movie.media_type;
  const title = isMovie ? movie.title : movie.name;
  const date = isMovie ? movie.release_date : movie.first_air_date;
  const year = date ? date.substring(0,4) : 'N/A';
  const typeUrl = isMovie ? 'movie' : 'tv';
  const watchedClass = movie.watched ? 'is-watched' : '';
  
  return `
    <div class="movie-card watchlist-card ${watchedClass}" data-id="${movie.id}">
      <img src="${getImageUrl(movie.poster_path, 'w500')}" alt="${title} Poster" loading="lazy">
      ${movie.watched ? '<div class="watched-badge">✔ Watched</div>' : ''}
      <div class="movie-info">
        <a href="detail.html?id=${movie.id}&type=${typeUrl}"><h3 class="movie-title">${title}</h3></a>
        <div class="movie-meta">
          <span class="movie-year">${year}</span>
        </div>
        <div class="watchlist-actions">
          <button class="btn btn-sm btn-toggle-watched">${movie.watched ? 'Mark Unwatched' : 'Mark Watched'}</button>
          <button class="btn btn-sm btn-danger btn-remove">Remove</button>
        </div>
      </div>
    </div>
  `;
}

function renderWatchlist() {
  const watchlist = getWatchlist();
  let filtered = watchlist;
  if(currentFilter === 'watched') filtered = watchlist.filter(m => m.watched);
  if(currentFilter === 'unwatched') filtered = watchlist.filter(m => !m.watched);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>🎬 Your watchlist is empty</h3>
        <p>Go to <a href="index.html">Home</a> and click on a movie to add it to your watchlist!</p>
      </div>
    `;
    return;
  }
  
  renderListWithTemplate(watchlistCardTemplate, grid, filtered, "afterbegin", true);
  
  // Attach event listeners to buttons
  const cards = grid.querySelectorAll('.watchlist-card');
  cards.forEach(card => {
    const id = parseInt(card.dataset.id);
    card.querySelector('.btn-toggle-watched').addEventListener('click', () => {
      toggleWatched(id);
      renderWatchlist();
    });
    card.querySelector('.btn-remove').addEventListener('click', () => {
      removeFromWatchlist(id);
      renderWatchlist();
    });
  });
}

function updateFilterButtons() {
  [btnAll, btnUnwatched, btnWatched].forEach(b => b.classList.remove('active', 'btn-secondary'));
  [btnAll, btnUnwatched, btnWatched].forEach(b => b.classList.add('btn-secondary'));
  
  if(currentFilter === 'all') { btnAll.classList.remove('btn-secondary'); btnAll.classList.add('active'); }
  else if(currentFilter === 'watched') { btnWatched.classList.remove('btn-secondary'); btnWatched.classList.add('active'); }
  else if(currentFilter === 'unwatched') { btnUnwatched.classList.remove('btn-secondary'); btnUnwatched.classList.add('active'); }
}

btnAll.addEventListener('click', () => { currentFilter = 'all'; updateFilterButtons(); renderWatchlist(); });
btnWatched.addEventListener('click', () => { currentFilter = 'watched'; updateFilterButtons(); renderWatchlist(); });
btnUnwatched.addEventListener('click', () => { currentFilter = 'unwatched'; updateFilterButtons(); renderWatchlist(); });

renderWatchlist();
