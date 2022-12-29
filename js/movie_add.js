'use strict';

const successToast = new bootstrap.Toast(
  document.getElementById('success-toast')
);
const failToast = new bootstrap.Toast(document.getElementById('fail-toast'));
const form = document.getElementById('movie-add-form');
form.addEventListener('submit', (event) => {
  handleFormSubmission(event, validators, properites);
});
setUpInputEvents(form, validators);

function handleFormSubmission(event, validators, properites) {
  event.preventDefault();

  const form = event.currentTarget;
  const [isFormValid, normalizedValues] = validateForm(form, validators);
  if (!isFormValid) {
    return;
  }

  const body = mapValuesToProperites(normalizedValues, properites);
  addMovie(body)
    .then(() => {
      successToast.show();
      resetForm(form);
    })
    .catch((error) => {
      failToast.show();
      console.error(`You had one job...${error}`);
    });
}
