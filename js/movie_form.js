'use strict';

const VALIDATORS_MAP = {
  title: validateTitleInput,
  year: validateYearInput,
  duration: validateDurationInput,
  director: validateDirectorInput,
  logo: validatePosterInput,
  rating: validateRatingInput,
  description: validateDescription,
};

function setUpInputEvents(form, validatorsMap) {
  for (const field of form) {
    if (!field.id || !(field.id in validatorsMap)) {
      continue;
    }
    field.addEventListener('input', () => validatorsMap[field.id](field));
    field.addEventListener('blur', () => validatorsMap[field.id](field));
  }
}

function populateFormFields(form, movie) {
  for (const [prop, value] of Object.entries(movie)) {
    form[prop].value = value;
  }
}

function resetForm(form) {
  form.reset();
  for (const field of form) {
    field.classList.remove('is-valid');
    field.classList.remove('is-validated');
  }
}

function normalizeValue(data, sanitize = true) {
  let normalized = data.trim();
  if (sanitize) {
    normalized = DOMPurify.sanitize(normalized, {
      ALLOWED_TAGS: '#text',
    });
  }
  return normalized;
}

async function validateForm(form, validatorsMap) {
  let seenInvalid = false;
  let normalizedValues = {};

  for (const field of form) {
    if (!field.id || !(field.id in validatorsMap)) {
      continue;
    }
    const [isValid, normalizedValue] =
      field.id === 'logo'
        ? await validatorsMap[field.id](field)
        : validatorsMap[field.id](field);

    if (seenInvalid) {
      continue;
    }

    if (!isValid) {
      seenInvalid = true;
      normalizedValues = {};
    } else {
      normalizedValues[field.id] = normalizedValue;
    }
  }

  if (seenInvalid) {
    return [false, null];
  }

  return [true, normalizedValues];
}

function validateTitleInput(titleInput) {
  const normalized = normalizeValue(titleInput.value);
  console.log(normalized);
  if (normalized.length === 0) {
    markAsInvalid(titleInput, 'Title is required!');
    return [false, null];
  }

  if (normalized.length < 2) {
    markAsInvalid(titleInput, 'Title is too short! (min: 2)');
    return [false, null];
  }

  if (normalized.length > 64) {
    markAsInvalid(titleInput, `Title is too long! (${normalized.length}/64)`);
    return [false, null];
  }

  markAsValid(titleInput);
  return [true, normalized];
}

function validateYearInput(yearInput) {
  const normalized = normalizeValue(yearInput.value, false);
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
  let normalized = normalizeValue(durationInput.value, false);
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
  const normalized = normalizeValue(directorInput.value);
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

// https://stackoverflow.com/a/9714891
function isValidImgUrl(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    let timer = null;
    const img = new Image();

    img.onerror = img.onabort = () => {
      clearTimeout(timer);
      reject(false);
    };

    img.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };

    timer = setTimeout(() => {
      // reset .src to invalid URL so it stops previous
      // loading, but doesn't trigger new load
      img.src = '//!!!!/test.jpg';
      reject(false);
    }, timeout);

    img.src = url;
  });
}

async function validatePosterInput(posterInput) {
  const normalized = normalizeValue(posterInput.value, false);

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

  try {
    await isValidImgUrl(normalized);
  } catch (error) {
    markAsInvalid(posterInput, "URL isn't a valid image!");
    return [false, null];
  }

  markAsValid(posterInput);
  return [true, normalized];
}

function validateRatingInput(ratingInput) {
  let normalized = normalizeValue(ratingInput.value, false);

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
  const normalized = normalizeValue(descriptionInput.value);
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
