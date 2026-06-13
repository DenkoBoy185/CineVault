import { getMovieDetail, getCredits, getVideos, getSimilar, getImageUrl } from './api.mjs';
import { getParam, renderListWithTemplate } from './utils.mjs';
import { addToWatchlist, isInWatchlist } from './watchlist.mjs';

const detailContainer = document.getElementById('detail-container');
const movieId = parseInt(getParam('id'));
const type = getParam('type') || 'movie';

async function loadDetail() {
  if (!movieId) {
    detailContainer.innerHTML = '<div class="loading">No movie ID provided.</div>';
    return;
  }
  
  try {
    const details = await getMovieDetail(movieId, type);
    const credits = await getCredits(movieId, type);
    const videos = await getVideos(movieId, type);
    const similar = await getSimilar(movieId, type);
    
    renderDetail(details, credits, videos, similar);
  } catch (err) {
    console.error(err);
    detailContainer.innerHTML = '<div class="loading">Failed to load movie details.</div>';
  }
}

function renderDetail(details, credits, videos, similar) {
  const isMovie = type === 'movie';
  const title = isMovie ? details.title : details.name;
  const date = isMovie ? details.release_date : details.first_air_date;
  const year = date ? date.substring(0,4) : 'N/A';
  const runtime = isMovie ? `${details.runtime} min` : `${details.number_of_seasons} Seasons`;
  const genres = details.genres ? details.genres.map(g => g.name).join(', ') : 'Unknown';
  const rating = details.vote_average ? details.vote_average.toFixed(1) : 'NR';
  
  // Find trailer
  let trailerKey = null;
  if(videos && videos.results) {
    const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    if(trailer) trailerKey = trailer.key;
  }
  
  const backdropUrl = details.backdrop_path ? getImageUrl(details.backdrop_path, 'original') : '';
  const posterUrl = getImageUrl(details.poster_path, 'w500');

  const inList = isInWatchlist(movieId);
  const btnText = inList ? 'Already in Watchlist' : 'Add to Watchlist';
  const btnDisabled = inList ? 'disabled' : '';

  let html = `
    <div class="backdrop" style="background-image: linear-gradient(to right, rgba(13,15,26,1) 150px, rgba(13,15,26,0.5) 100%), url('${backdropUrl}')">
      <div class="backdrop-content">
        <img src="${posterUrl}" alt="${title} Poster" class="detail-poster" />
        <div class="detail-meta">
          <h1>${title} <span>(${year})</span></h1>
          <div class="meta-row">
            <span class="rating">★ ${rating}</span>
            <span class="genres">${genres}</span>
            <span class="runtime">${runtime}</span>
          </div>
          <div class="action-buttons">
            <button id="add-watchlist-btn" class="btn btn-secondary" ${btnDisabled}>${btnText}</button>
            ${trailerKey ? `<a href="https://www.youtube.com/watch?v=${trailerKey}" target="_blank" class="btn btn-primary">Watch Trailer</a>` : ''}
          </div>
          <div class="overview">
            <h3>Overview</h3>
            <p>${details.overview || 'No overview available.'}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Cast
  if(credits && credits.cast && credits.cast.length > 0) {
    const topCast = credits.cast.slice(0, 8);
    const castHtml = topCast.map(actor => `
      <div class="cast-card">
        <img src="${getImageUrl(actor.profile_path, 'w185')}" alt="${actor.name}" loading="lazy">
        <div class="cast-info">
          <h4>${actor.name}</h4>
          <p>${actor.character}</p>
        </div>
      </div>
    `).join('');
    
    html += `
      <section class="cast-section">
        <h2>Top Cast</h2>
        <div class="cast-carousel">
          ${castHtml}
        </div>
      </section>
    `;
  }
  
  // Similar
  if(similar && similar.length > 0) {
    const topSimilar = similar.slice(0, 4);
    const similarHtml = topSimilar.map(item => {
      const sTitle = isMovie ? item.title : item.name;
      const sDate = isMovie ? item.release_date : item.first_air_date;
      const sYear = sDate ? sDate.substring(0,4) : 'N/A';
      return `
      <a href="detail.html?id=${item.id}&type=${type}" class="movie-card">
        <img src="${getImageUrl(item.poster_path, 'w500')}" alt="${sTitle}" loading="lazy">
        <div class="movie-info">
          <h3 class="movie-title">${sTitle}</h3>
          <div class="movie-meta">
            <span class="movie-year">${sYear}</span>
            <span class="movie-rating">★ ${item.vote_average ? item.vote_average.toFixed(1) : 'NR'}</span>
          </div>
        </div>
      </a>
    `}).join('');
    
    html += `
      <section class="similar-section">
        <h2>You Might Also Like</h2>
        <div class="movie-grid">
          ${similarHtml}
        </div>
      </section>
    `;
  }

  detailContainer.innerHTML = html;
  
  // Attach event listener
  const btn = document.getElementById('add-watchlist-btn');
  if(btn && !inList) {
    btn.addEventListener('click', () => {
      addToWatchlist({
        id: movieId,
        media_type: type,
        title: details.title,
        name: details.name,
        release_date: details.release_date,
        first_air_date: details.first_air_date,
        poster_path: details.poster_path,
        vote_average: details.vote_average
      });
      btn.innerText = 'Added to Watchlist';
      btn.disabled = true;
    });
  }
}

loadDetail();
