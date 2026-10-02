const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const button = document.getElementById('searchBtn');
const container = document.getElementById('moviecontainer');
const title = document.getElementById('resultsTitle');
const count = document.getElementById('resultCount');
const API_KEY = '95b2cc0d';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) {
    input.focus();
    showMessage('Type a movie or actor name to start exploring.');
    return;
  }

  title.textContent = `Searching: ${query}`;
  count.textContent = '';
  button.disabled = true;
  button.textContent = 'Searching...';
  container.innerHTML = '<div class="status-message">Finding your next favorite...</div>';

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not successful.');
    const data = await response.json();
    if (data.Response === 'False' || !Array.isArray(data.Search)) {
      title.textContent = 'No films found';
      showMessage(data.Error === 'Invalid API key!' ? 'The movie search service needs a valid API key.' : `No results for "${query}". Try another title or spelling.`, true);
      return;
    }
    title.textContent = 'Your search results';
    count.textContent = `${data.Search.length} ${data.Search.length === 1 ? 'FILM' : 'FILMS'}`;
    container.replaceChildren(...data.Search.map(createCard));
  } catch (error) {
    title.textContent = 'Search unavailable';
    showMessage('We could not reach the movie database. Check your connection and try again.', true);
  } finally {
    button.disabled = false;
    button.innerHTML = 'Explore <span aria-hidden="true">&rarr;</span>';
  }
});

function createCard(movie) {
  const link = document.createElement('a');
  link.className = 'movie-card';
  link.href = `movie.html?imdbID=${encodeURIComponent(movie.imdbID)}`;
  link.setAttribute('aria-label', `View ${movie.Title}, ${movie.Year}`);

  const poster = document.createElement('div');
  poster.className = 'poster-wrap';
  const image = document.createElement('img');
  image.src = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'Cinematic%20Movie%20Lens%20Logo.png';
  image.alt = `${movie.Title} poster`;
  image.loading = 'lazy';
  image.onerror = () => { image.src = 'Cinematic%20Movie%20Lens%20Logo.png'; };
  const year = document.createElement('span');
  year.className = 'year-tag';
  year.textContent = movie.Year || 'Year unknown';
  poster.append(image, year);

  const copy = document.createElement('div');
  copy.className = 'movie-copy';
  const name = document.createElement('h3');
  name.textContent = movie.Title;
  const type = document.createElement('span');
  type.className = 'movie-type';
  type.textContent = movie.Type || 'Movie';
  copy.append(name, type);
  link.append(poster, copy);
  return link;
}

function showMessage(message, isError = false) {
  const state = document.createElement('div');
  state.className = `status-message${isError ? ' error' : ''}`;
  state.textContent = message;
  container.replaceChildren(state);
}
