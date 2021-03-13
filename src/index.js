import * as yup from 'yup';
import parseResponse from './parseResponse.js';
import watchState from './view/index.js';
import 'regenerator-runtime/runtime.js'; // https://github.com/babel/babel/issues/9849#issuecomment-487040428
import 'bootstrap/dist/css/bootstrap.min.css';

const fetchFeed = (url) => (
  fetch(url)
    .then((response) => response.text())
    .then((str) => (new window.DOMParser()).parseFromString(str, 'text/xml'))
);

const app = () => {
  const state = {
    form: {
      status: 'untouched',
      processError: null,
      url: '',
      valid: false,
      errors: {},
    },
    feeds: [],
  };

  const watchedState = watchState(state);

  const schema = yup.object().shape({
    feedUrl: yup.string().required().url().notOneOf(state.feeds.map((feed) => feed.url), 'RSS уже существует'),
  });

  const validateForm = (formData) => schema.validate(formData);

  const form = document.querySelector('#rss-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // validation on submit
    const formData = new FormData(event.target);
    const url = formData.get('url');
    validateForm({ feedUrl: url })
      .then(() => {
        fetchFeed(url)
          .then((xmlDoc) => {
            const parsedFeed = parseResponse(xmlDoc);
            watchedState.feeds.push({ url, ...parsedFeed });
          });
      })
      .catch((err) => {
        console.log(err.name); // => 'ValidationError'
        console.log(err.errors);
      });
  });
};

app();
