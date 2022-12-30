'use strict';

const movieDetails = document.getElementById('movie-details');
const id = getQueryStringParameterByName('id');
if (id) {
  getMovie(id)
    .then((data) => {
      movieDetails.innerHTML = createMovieDetails(data);
    })
    .catch((error) => {
      movieDetails.innerHTML = '<p class="text-danger">There was an error.</p>';
      console.error(`You had one job...${error}`);
    });
} else {
  window.location.href = 'index.html';
}

function createMovieDetails(movie) {
  return `
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="./index.html">Movies</a></li>
        <li class="breadcrumb-item active">${movie.title}</li>
      </ol>
    </nav>
    <article class="d-flex flex-column gap-3">
      <header
        class="article-header d-flex align-items-center justify-content-between gap-3">
        <div class="article-header-left">
          <h2 class="mb-0">
            ${movie.title} <span class="text-muted">(${movie.year})</span>
          </h2>
        </div>
        <div class="article-header-right d-flex gap-2">
          <a href="./movie_edit.html?id=${movie.id}" class="btn btn-warning">
            <span class="icon">
              <i class="bi bi-pencil-fill"></i>
            </span>
            <span class="d-none d-md-inline">Edit</span>
          </a>
          <a href="./movie_delete.html?id=${movie.id}" class="btn btn-danger">
            <span class="icon">
              <i class="bi bi-trash-fill"></i>
            </span>
            <span class="d-none d-md-inline">Delete</span>
          </a>
        </div>
      </header>
      <div class="article-body d-flex flex-column flex-md-row gap-4">
        <div class="article-image text-center">
          <img
            class="rounded-3 shadow-sm"
            src="${movie.logo}"
            alt="${movie.title} poster" />
        </div>
        <div class="article-text d-flex flex-column">
          <section>
            <h3>Description</h3>
            <p>${movie.description}</p>
          </section>
          <section>
            <h3>Rating</h3>
            <p class="rating">
              <span class="icon">
                <i class="bi bi-star-fill"></i>
              </span>
              <span>${movie.rating}/10</span>
            </p>
          </section>

          <section>
            <h3>Duration</h3>
            <p class="duration">
              <span class="icon">
                <i class="bi bi-clock-fill"></i>
              </span>
              <span>${formatDuration(movie.duration)}</span>
            </p>
          </section>

          <section>
            <h3>Director</h3>
            <p>${movie.director}</p>
          </section>
        </div>
      </div>
    </article>
  `;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  if (hours === 0) {
    return `${remain}m`;
  }
  return `${hours}h ${remain}m`;
}
