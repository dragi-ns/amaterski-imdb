'use strict';

const movieList = document.getElementById('movie-list');
getMovies()
  .then((data) => {
    const movieCards = data.map(createMovieCard);
    movieList.innerHTML = movieCards.join('');
  })
  .catch((error) => {
    movieList.innerHTML = '<p class="text-danger">There was an error.</p>';
    console.error(`You had one job...${error}`);
  });

function createMovieCard(movie) {
  return `
    <div class="col-auto">
      <div class="card movie-card position-relative rounded-3 overflow-hidden">
        <a href="./movie_view.html?id=${movie.id}">
          <img
            src="${movie.logo}"
            alt="${movie.title} poster"
            class="card-img" />
        </a>
        <div
          style="pointer-events: none; cursor: pointer"
          class="card-body position-absolute w-100 bottom-0 text-white bg-black bg-opacity-75">
          <h3 class="card-title">${movie.title}</h3>
          <div class="card-text d-flex justify-content-between">
            <p class="m-0">
              <span className="icon">
                <i class="bi bi-calendar3"></i>
              </span>
              <span>
                ${movie.year}
              </span>
            </p>
            <p class="m-0">
              <span className="icon">
                <i class="bi bi-star-fill"></i>
              </span>
              <span>
                ${movie.rating}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    `;
}
