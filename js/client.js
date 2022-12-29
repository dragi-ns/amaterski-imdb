'use strict';

const BASE_URL = 'http://localhost:3000';

async function getMovies() {
  const response = await fetch(`${BASE_URL}/movies`);
  return response.json();
}

async function getMovie(id) {
  const response = await fetch(`${BASE_URL}/movies/${id}`);
  return response.json();
}

async function addMovie(body) {
  const response = await fetch(`${BASE_URL}/movies`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
