'use strict';

const successToast = new bootstrap.Toast(
  document.getElementById('success-toast')
);
const failToast = new bootstrap.Toast(document.getElementById('fail-toast'));
const form = document.getElementById('movie-add-form');
setUpInputEvents(form, VALIDATORS_MAP);
form.addEventListener('submit', handleFormSubmission);

function handleFormSubmission(event) {
  event.preventDefault();

  const [isFormValid, normalizedValues] = validateForm(form, VALIDATORS_MAP);
  if (!isFormValid) {
    return;
  }

  addMovie(normalizedValues)
    .then(() => {
      successToast.show();
      resetForm(form);
    })
    .catch((error) => {
      failToast.show();
      console.error(`You had one job...${error}`);
    });
}
