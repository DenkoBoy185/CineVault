import { getTrending, searchMulti, getImageUrl, getGenres } from './api.mjs';
import { debounce, renderListWithTemplate } from './utils.mjs';

const grid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const genreContainer = document.getElementById('genre-container');
const sortSelect = document.getElementById('sort-select');

let currentMovies = [];

function movieCardTemplate(movie) {
  const isMovie = movie.media_type === 'movie' || !movie.media_type;
  const title = isMovie ? movie.title : movie.name;
  const date = isMovie ? movie.release_date : movie.first_air_date;
  const year = date ? date.substring(0,4) : 'N/A';
  const typeUrl = isMovie ? 'movie' : 'tv';
  
  return `
    <a href="detail.html?id=${movie.id}&type=${typeUrl}" class="movie-card">
      <img src="${getImageUrl(movie.poster_path, 'w500')}" alt="${title} Poster" loading="lazy">
      <div class="movie-info">
        <h3 class="movie-title">${title}</h3>
        <div class="movie-meta">
          <span class="movie-year">${year}</span>
          <span class="movie-rating">★ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
        </div>
      </div>
    </a>
  `;
}

function searchResultTemplate(result) {
  const isMovie = result.media_type === 'movie' || !result.media_type;
  const title = isMovie ? result.title : result.name;
  const date = isMovie ? result.release_date : result.first_air_date;
  const year = date ? date.substring(0,4) : 'N/A';
  const typeUrl = isMovie ? 'movie' : 'tv';

  return `
    <a href="detail.html?id=${result.id}&type=${typeUrl}" class="search-item">
      <img src="${getImageUrl(result.poster_path, 'w92')}" alt="${title}">
      <div>
        <h4>${title}</h4>
        <span>${year}</span>
      </div>
    </a>
  `;
}

async function loadTrending() {
  try {
    currentMovies = await getTrending();
    renderMovies();
  } catch (err) {
    grid.innerHTML = `<div class="loading" style="color:red">Failed to load movies. Error: ${err.message || err}</div>`;
  }
}

let currentGenreId = null;

async function loadGenres() {
  try {
    const genres = await getGenres('movie');
    if(genres) {
      const html = genres.map(g => `<button class="genre-btn" data-id="${g.id}">${g.name}</button>`).join('');
      genreContainer.innerHTML = html;
      
      // Add event listeners to genre buttons
      const btns = genreContainer.querySelectorAll('.genre-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.dataset.id);
          if(currentGenreId === id) {
            currentGenreId = null; // deselect
            e.target.classList.remove('active');
          } else {
            currentGenreId = id;
            btns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
          }
          filterAndRenderMovies();
        });
      });
    }
  } catch (error) {
    console.error("Failed to load genres", error);
  }
}

function filterAndRenderMovies() {
  if (!currentMovies || currentMovies.length === 0) return;
  
  let filtered = currentMovies;
  if(currentGenreId) {
    filtered = currentMovies.filter(m => m.genre_ids && m.genre_ids.includes(currentGenreId));
  }
  
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="loading">No movies found for this genre.</div>';
    return;
  }

  let sorted = [...filtered];
  const sortVal = sortSelect.value;
  if(sortVal === 'popularity.desc') {
    sorted.sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
  } else if(sortVal === 'vote_average.desc') {
    sorted.sort((a,b) => (b.vote_average || 0) - (a.vote_average || 0));
  } else if(sortVal === 'release_date.desc') {
    sorted.sort((a,b) => {
      const dA = new Date(a.release_date || a.first_air_date || 0);
      const dB = new Date(b.release_date || b.first_air_date || 0);
      return dB - dA;
    });
  }

  renderListWithTemplate(movieCardTemplate, grid, sorted, "afterbegin", true);
}

// Override original renderMovies to use filterAndRenderMovies
function renderMovies() {
  filterAndRenderMovies();
}

const handleSearch = debounce(async (e) => {
  const query = e.target.value.trim();
  if (query.length < 2) {
    searchResults.innerHTML = '';
    searchResults.classList.add('hidden');
    return;
  }
  
  try {
    const results = await searchMulti(query);
    if(results.length > 0) {
      renderListWithTemplate(searchResultTemplate, searchResults, results.slice(0,5), "afterbegin", true);
      searchResults.classList.remove('hidden');
    } else {
      searchResults.innerHTML = '<div class="search-item">No results found</div>';
      searchResults.classList.remove('hidden');
    }
  } catch (error) {
    console.error(error);
  }
}, 400);

// Event Listeners
searchInput.addEventListener('input', handleSearch);
document.addEventListener('click', (e) => {
  if(!e.target.closest('.search-container')) {
    searchResults.classList.add('hidden');
  }
});
sortSelect.addEventListener('change', renderMovies);

// Global Error Handler for debugging
window.addEventListener('error', (e) => {
  grid.innerHTML = `<div class="loading" style="color:red">JS Error: ${e.message}</div>`;
});
window.addEventListener('unhandledrejection', (e) => {
  grid.innerHTML = `<div class="loading" style="color:red">Async Error: ${e.reason}</div>`;
});

// Init
loadTrending();
loadGenres();
