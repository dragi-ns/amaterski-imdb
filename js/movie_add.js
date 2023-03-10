'use strict';

const successToast = new bootstrap.Toast(
  document.getElementById('success-toast')
);
const failToast = new bootstrap.Toast(document.getElementById('fail-toast'));
const cancelBtn = document.getElementById('cancel-btn');
const form = document.getElementById('movie-add-form');
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
    await addMovie(normalizedValues);
  } catch (error) {
    failToast.show();
    console.error(`You had one job...${error}`);
    return;
  }

  successToast.show();
  resetForm(form);
}
