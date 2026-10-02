const params = new URLSearchParams(window.location.search);
const imdbID = params.get('imdbID');
const container = document.getElementById('movieDetails');
const API_KEY = '95b2cc0d';

if (!imdbID) {
  showError('No film was selected. Head back to discovery and choose a title.');
} else {
  loadMovie();
}

async function loadMovie() {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`);
    if (!response.ok) throw new Error('Network response was not successful.');
    const movie = await response.json();
    if (movie.Response === 'False') throw new Error(movie.Error || 'Film details could not be found.');

    document.title = `${movie.Title} - Movie Lens`;
    const details = document.createElement('section');
    details.className = 'details';
    const poster = document.createElement('img');
    poster.className = 'details-poster';
    poster.src = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'Cinematic%20Movie%20Lens%20Logo.png';
    poster.alt = `${movie.Title} poster`;
    poster.onerror = () => { poster.src = 'Cinematic%20Movie%20Lens%20Logo.png'; };

    const info = document.createElement('div');
    info.className = 'info';
    const kicker = document.createElement('div');
    kicker.className = 'detail-kicker';
    kicker.textContent = `${movie.Type || 'Film'} | ${movie.Rated && movie.Rated !== 'N/A' ? movie.Rated : 'Details'}`;
    const heading = document.createElement('h1');
    heading.textContent = movie.Title;

    const metadata = document.createElement('div');
    metadata.className = 'meta-row';
    [movie.Year, movie.Runtime, movie.Genre].filter(value => value && value !== 'N/A').forEach(value => {
      const pill = document.createElement('span');
      pill.className = 'meta-pill';
      pill.textContent = value;
      metadata.append(pill);
    });
    if (movie.imdbRating && movie.imdbRating !== 'N/A') {
      const rating = document.createElement('span');
      rating.className = 'meta-pill rating';
      rating.textContent = `IMDb ${movie.imdbRating} / 10`;
      metadata.append(rating);
    }

    const plot = document.createElement('p');
    plot.className = 'plot';
    plot.textContent = movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'A plot summary is not available for this title.';
    const facts = document.createElement('div');
    facts.className = 'detail-facts';
    addFact(facts, 'Director', movie.Director);
    addFact(facts, 'Starring', movie.Actors);
    addFact(facts, 'Awards', movie.Awards);
    addFact(facts, 'Language', movie.Language);
    const trailer = document.createElement('button');
    trailer.className = 'trailer-button';
    trailer.type = 'button';
    trailer.textContent = 'Find the trailer';
    trailer.addEventListener('click', () => {
      const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.Title} official trailer`)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    info.append(kicker, heading, metadata, plot, facts, trailer);
    details.append(poster, info);
    container.replaceChildren(details);
  } catch (error) {
    showError(error.message || 'We could not load this film. Try again in a moment.');
  }
}

function addFact(parent, label, value) {
  if (!value || value === 'N/A') return;
  const wrapper = document.createElement('div');
  const name = document.createElement('span');
  name.className = 'fact-label';
  name.textContent = label;
  const content = document.createElement('span');
  content.className = 'fact-value';
  content.textContent = value;
  wrapper.append(name, content);
  parent.append(wrapper);
}

function showError(message) {
  const state = document.createElement('div');
  state.className = 'detail-state';
  state.textContent = message;
  container.replaceChildren(state);
}
