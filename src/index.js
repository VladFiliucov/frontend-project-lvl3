import parseResponse from './parseResponse.js';
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

  const schema = yup.object().shape({
    feedUrl: yup.string().required().url().notOneOf(state.feeds.map(feed => feed.url)),
  });

  const validateForm = async (formData) => {
    const result = await schema.isValid(formData);
    console.log("asdfadfadfa", result);
  }

  const form = document.querySelector('#rss-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // validation on submit
    const formData = new FormData(event.target);
    validateForm({ feedUrl: formData.get('url') });
    fetch('https://ru.hexlet.io/lessons.rss')
      .then((response) => response.text())
      .then((str) => (new window.DOMParser()).parseFromString(str, 'text/xml'))
      .then((xmlDoc) => console.log(parseResponse(xmlDoc)));
  });
};

app();
