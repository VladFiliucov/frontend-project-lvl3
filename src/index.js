import * as yup from 'yup';
import parseResponse from './parseResponse.js';
import localePromise from './initializers/i18n.js';
import watchState from './view/index.js';
import 'regenerator-runtime/runtime.js'; // https://github.com/babel/babel/issues/9849#issuecomment-487040428
import 'bootstrap/dist/css/bootstrap.min.css';

const fetchFeed = (url) => (
  fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => response.json())
    .then((str) => (new window.DOMParser()).parseFromString(str.contents, 'text/xml'))
);

const app = (t) => {
  const state = {
    form: {
      status: 'untouched',
      processError: null,
      url: '',
      valid: false,
      errors: [],
    },
    feeds: [],
  };

  yup.setLocale({
    // use constant translation keys for messages without values
    string: {
      // Почему не сработало просто с ключем?
      url: t('urlInvalid'),
    },
    // mixed: {
    //   default: 'field_invalid',
    // },
    // // use functions to generate an error object that includes the value from the schema
    // number: {
    //   min: ({ min }) => ({ key: 'field_too_short', values: { min } }),
    //   max: ({ max }) => ({ key: 'field_too_big', values: { max } }),
    // },
  });

  const watchedState = watchState(state, t);

  const validateForm = (formData) => {
    const schema = yup.object().shape({
      feedUrl: yup
        .string()
        .required()
        .url()
        .notOneOf(watchedState.feeds.map((feed) => feed.url), 'RSS уже существует'),
    });
    return schema.validate(formData);
  };

  const form = document.querySelector('#rss-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    validateForm({ feedUrl: url })
      .then(() => {
        watchedState.form.errors = [];
        fetchFeed(url)
          .then((xmlDoc) => {
            const parsedFeed = parseResponse(xmlDoc);
            watchedState.feeds.push({ url, ...parsedFeed });
          })
          .catch(() => {
            watchedState.form.errors = [t('networkError')];
          });
      })
      .catch((err) => {
        // console.log(err.name); // => 'ValidationError'
        // console.log(err.errors);
        watchedState.form.errors = err.errors;
      });
  });
};

localePromise.then((text) => {
  app(text);
});
