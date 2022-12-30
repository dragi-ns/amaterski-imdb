'use strict';

const successToast = new bootstrap.Toast(
  document.getElementById('success-toast')
);
const failToast = new bootstrap.Toast(document.getElementById('fail-toast'));
const movieName = document.getElementById('movie-name');
const cancelBtn = document.getElementById('cancel-btn');
const form = document.getElementById('movie-delete-form');
const id = getQueryStringParameterByName('id');
if (id) {
  getMovie(id)
    .then((data) => {
      movieName.textContent = `"${data.title}"`;
    })
    .catch((error) => {
      failToast.show();
      console.error(`You had one job...${error}`);
    });
} else {
  window.location.href = 'index.html';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  // For now just console.log the reason
  console.log(form.reason.value);

  deleteMovie(id)
    .then(() => {
      successToast.show();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 750);
    })
    .catch((error) => {
      failToast.show();
      console.error(`You had one job...${error}`);
    });
});
cancelBtn.addEventListener('click', () => goBack());
