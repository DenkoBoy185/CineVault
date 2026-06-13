// Watchlist Module (LocalStorage)
const WATCHLIST_KEY = 'cinevault_watchlist';

export function getWatchlist() {
  const data = localStorage.getItem(WATCHLIST_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveWatchlist(watchlist) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
}

export function addToWatchlist(movie) {
  const watchlist = getWatchlist();
  if (!watchlist.some(item => item.id === movie.id)) {
    // Add default watched property
    movie.watched = false;
    watchlist.push(movie);
    saveWatchlist(watchlist);
    return true; // Added
  }
  return false; // Already exists
}

export function removeFromWatchlist(id) {
  let watchlist = getWatchlist();
  watchlist = watchlist.filter(item => item.id !== id);
  saveWatchlist(watchlist);
}

export function toggleWatched(id) {
  const watchlist = getWatchlist();
  const index = watchlist.findIndex(item => item.id === id);
  if (index !== -1) {
    watchlist[index].watched = !watchlist[index].watched;
    saveWatchlist(watchlist);
  }
}

export function isInWatchlist(id) {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id === id);
}
