'use strict';

const successToast = new bootstrap.Toast(
  document.getElementById('success-toast')
);
const failToast = new bootstrap.Toast(document.getElementById('fail-toast'));
const form = document.getElementById('movie-add-form');
const validators = [
  validateTitleInput,
  validateYearInput,
  validateDurationInput,
  validateDirectorInput,
  validatePosterInput,
  validateRatingInput,
  validateDescription,
];
setUpInputEvents(form, validators);
form.addEventListener('submit', (event) => {
  handleFormSubmission(event, validators);
});

function setUpInputEvents(form, validators) {
  for (let i = 0; i < form.elements.length - 1; i++) {
    const field = form.elements[i];
    field.addEventListener('input', () => validators[i](field));
    field.addEventListener('blur', () => validators[i](field));
  }
}

function handleFormSubmission(event, validators) {
  event.preventDefault();

  const form = event.currentTarget;
  let seenInvalid = false;
  let normalizedValues = [];
  for (let i = 0; i < form.elements.length - 1; i++) {
    const field = form.elements[i];
    const [isValid, normalizedValue] = validators[i](field);
    if (seenInvalid) {
      continue;
    }

    if (!isValid) {
      seenInvalid = true;
      normalizedValues = [];
    } else {
      normalizedValues.push(normalizedValue);
    }
  }

  if (seenInvalid) {
    return;
  }

  const properites = [
    'title',
    'year',
    'duration',
    'director',
    'logo',
    'rating',
    'description',
  ];
  const body = mapValuesToProperites(normalizedValues, properites);

  fetch('http://localhost:3000/movies', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(() => {
      successToast.show();
      form.reset();
      for (const field of form.elements) {
        field.classList.remove('is-valid');
        field.classList.remove('is-validated');
      }
    })
    .catch((error) => {
      failToast.show();
      console.error(`You had one job...${error}`);
    });
}

function mapValuesToProperites(values, properites) {
  return values.reduce((accumulator, value, index) => {
    accumulator[properites[index]] = value;
    return accumulator;
  }, {});
}

// VALIDATORS

function validateTitleInput(titleInput) {
  const normalized = titleInput.value.trim();
  if (normalized.length === 0) {
    markAsInvalid(titleInput, 'Title is required!');
    return [false, null];
  }

  if (normalized.length < 2) {
    markAsInvalid(titleInput, 'Title is too short! (min: 2)');
    return [false, null];
  }

  if (normalized.length > 48) {
    markAsInvalid(titleInput, `Title is too long! (${normalized.length}/48)`);
    return [false, null];
  }

  markAsValid(titleInput);
  return [true, normalized];
}

function validateYearInput(yearInput) {
  const normalized = yearInput.value.trim();
  if (normalized.length < 1) {
    markAsInvalid(yearInput, 'Year is required!');
    return [false, null];
  }

  const match = normalized.match(/^(18|19|20)\d{2}$/g);
  if (!match) {
    markAsInvalid(yearInput, 'Year is invalid! (valid: 1800-2099)');
    return [false, null];
  }

  markAsValid(yearInput);
  return [true, normalized];
}

function validateDurationInput(durationInput) {
  let normalized = durationInput.value.trim();
  if (normalized.length === 0) {
    markAsInvalid(durationInput, 'Duration is required!');
    return [false, null];
  }

  normalized = parseInt(normalized);
  if (normalized < 1) {
    markAsInvalid(durationInput, 'Duration is too low! (min: 1)');
    return [false, null];
  }

  if (normalized > 1440) {
    markAsInvalid(durationInput, `Duration is too high! (max: 1440)`);
    return [false, null];
  }

  markAsValid(durationInput);
  return [true, normalized];
}

function validateDirectorInput(directorInput) {
  const normalized = directorInput.value.trim();
  if (normalized.length === 0) {
    markAsInvalid(directorInput, 'Director is required!');
    return [false, null];
  }

  if (normalized.length < 2) {
    markAsInvalid(directorInput, 'Director is too short! (min: 2)');
    return [false, null];
  }

  if (normalized.length > 48) {
    markAsInvalid(
      directorInput,
      `Director is too long! (${normalized.length}/48)`
    );
    return [false, null];
  }

  markAsValid(directorInput);
  return [true, normalized];
}

function validatePosterInput(posterInput) {
  const normalized = posterInput.value.trim();

  if (normalized.length === 0) {
    markAsInvalid(posterInput, 'Poster is required!');
    return [false, null];
  }

  const match = normalized.match(
    /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g
  );
  if (!match) {
    markAsInvalid(posterInput, 'URL is invalid!');
    return [false, null];
  }
  markAsValid(posterInput);
  return [true, normalized];
}

function validateRatingInput(ratingInput) {
  let normalized = ratingInput.value.trim();

  if (normalized.length === 0) {
    markAsInvalid(ratingInput, 'Rating is required!');
    return [false, null];
  }

  normalized = +normalized;
  if (normalized < 1) {
    markAsInvalid(ratingInput, 'Rating is too low! (min: 1)');
    return [false, null];
  }

  if (normalized > 10) {
    markAsInvalid(ratingInput, `Rating is too high! (max: 10)`);
    return [false, null];
  }

  markAsValid(ratingInput);
  return [true, +normalized.toPrecision(2)];
}

function validateDescription(descriptionInput) {
  const normalized = descriptionInput.value.trim();
  if (normalized.length === 0) {
    markAsInvalid(descriptionInput, 'Description is required!');
    return [false, null];
  }

  if (normalized.length < 16) {
    markAsInvalid(
      descriptionInput,
      `Description is too short! (${normalized.length}/16)`
    );
    return [false, null];
  }

  if (normalized.length > 512) {
    markAsInvalid(
      descriptionInput,
      `Description is too long! (${normalized.length}/512)`
    );
    return [false, null];
  }

  markAsValid(descriptionInput);
  return [true, normalized];
}

function markAsValid(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  input.classList.add('is-validated');
  input.nextElementSibling.textContent = '';
}

function markAsInvalid(input, msg) {
  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
  input.classList.add('is-validated');
  input.nextElementSibling.textContent = msg;
}
