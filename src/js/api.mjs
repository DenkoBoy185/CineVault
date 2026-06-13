const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB(endpoint) {
  if (!API_KEY) {
    console.warn("No TMDB API Key found. Returning mock data or throwing error.");
    throw new Error("TMDB API Key is missing. Add VITE_TMDB_API_KEY to your .env file.");
  }
  
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from TMDB (${endpoint}):`, error);
    throw error;
  }
}

export async function getTrending() {
  const data = await fetchFromTMDB('/trending/all/day');
  return data.results;
}

export async function searchMulti(query) {
  if (!query) return [];
  const encodedQuery = encodeURIComponent(query);
  const data = await fetchFromTMDB(`/search/multi?query=${encodedQuery}`);
  return data.results;
}

export async function getMovieDetail(id, type = 'movie') {
  // type can be 'movie' or 'tv'
  return await fetchFromTMDB(`/${type}/${id}`);
}

export async function getCredits(id, type = 'movie') {
  return await fetchFromTMDB(`/${type}/${id}/credits`);
}

export async function getVideos(id, type = 'movie') {
  return await fetchFromTMDB(`/${type}/${id}/videos`);
}

export async function getSimilar(id, type = 'movie') {
  const data = await fetchFromTMDB(`/${type}/${id}/similar`);
  return data.results;
}

export async function getGenres(type = 'movie') {
  const data = await fetchFromTMDB(`/genre/${type}/list`);
  return data.genres;
}

export function getImageUrl(path, size = 'w500') {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
