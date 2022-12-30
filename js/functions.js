'use strict';

function getQueryStringParameterByName(name) {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function navigate(location) {
  window.location.href = location;
}

function goBack() {
  window.history.back();
}
