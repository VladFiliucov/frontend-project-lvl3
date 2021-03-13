import parseResponse from './parseResponse.js';
import watchState from './view/index.js';
import 'regenerator-runtime/runtime.js'; // https://github.com/babel/babel/issues/9849#issuecomment-487040428
import * as yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = () => {
  const state = {
    form: {
      status: 'untouched',
      processError: null,
      url: '',
      valid: false,
      errors: {},
    },
    feeds: [{
      url: 'https://ru.hexlet.io/lessons.rss',
      title: 'foo',
      description: 'bar',
      items: [
        {
          title: 'Рациональные числа',
          link: 'https://ru.hexlet.io/courses/ruby-compound-data/lessons/rational/theory_unit',
          description: 'Цель: Рассмотреть рациональные числа как новый пример абстракции на основе пар чисел.'
        }
      ]
    }],
  };

  const watchedState = watchState(state);

  const schema = yup.object().shape({
    feedUrl: yup.string().required().url().notOneOf(state.feeds.map(feed => feed.url), 'RSS уже существует'),
  });

  const validateForm = (formData) => schema.validate(formData);

  const form = document.querySelector('#rss-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // validation on submit
    const formData = new FormData(event.target);
    validateForm({ feedUrl: formData.get('url') })
      .then(() => {
        fetch('https://ru.hexlet.io/lessons.rss')
          .then((response) => response.text())
          .then((str) => (new window.DOMParser()).parseFromString(str, 'text/xml'))
          .then((xmlDoc) => console.log(parseResponse(xmlDoc)));
        watchedState.feeds.push({url: 'Hithere'})
        console.log("shouldnt bee here if validation failed");
      })
      .catch((err) => {
        console.log(err.name); // => 'ValidationError'
        console.log(err.errors);
      })
  });
};

app();
