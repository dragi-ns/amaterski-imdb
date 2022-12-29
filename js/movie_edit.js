'use strict';

const successToast = new bootstrap.Toast(
  document.getElementById('success-toast')
);
const failToast = new bootstrap.Toast(document.getElementById('fail-toast'));
const form = document.getElementById('movie-edit-form');
const id = getQueryStringParameterByName('id');
if (id) {
  getMovie(id)
    .then((data) => populateFormFields(form, data))
    .catch((error) => {
      failToast.show();
      console.error(`You had one job...${error}`);
    });
} else {
  window.location.href = 'index.html';
}

setUpInputEvents(form, VALIDATORS_MAP);
form.addEventListener('submit', handleFormSubmission);

function handleFormSubmission(event) {
  event.preventDefault();

  const [isFormValid, normalizedValues] = validateForm(form, VALIDATORS_MAP);
  if (!isFormValid) {
    return;
  }

  editMovie(id, normalizedValues)
    .then(() => {
      successToast.show();
      setTimeout(() => {
        window.history.back();
      }, 750);
    })
    .catch((error) => {
      failToast.show();
      console.error(`You had one job...${error}`);
    });
}
