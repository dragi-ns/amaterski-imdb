'use strict';

const successToast = new bootstrap.Toast(
  document.getElementById('success-toast')
);
const failToast = new bootstrap.Toast(document.getElementById('fail-toast'));
const cancelBtn = document.getElementById('cancel-btn');
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
cancelBtn.addEventListener('click', () => goBack());

async function handleFormSubmission(event) {
  event.preventDefault();

  const [isFormValid, normalizedValues] = await validateForm(
    form,
    VALIDATORS_MAP
  );
  if (!isFormValid) {
    return;
  }

  try {
    await editMovie(id, normalizedValues);
  } catch (error) {
    failToast.show();
    console.error(`You had one job...${error}`);
    return;
  }

  successToast.show();
  setTimeout(() => {
    window.location.href = `movie_view.html?id=${id}`;
  }, 750);
}
