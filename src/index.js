import parseResponse from './parseResponse.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = () => {
  const form = document.querySelector('#rss-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    fetch('https://ru.hexlet.io/lessons.rss')
      .then((response) => response.text())
      .then((str) => (new window.DOMParser()).parseFromString(str, 'text/xml'))
      .then((data) => console.log(parseResponse(data)));
  });
};

app();
