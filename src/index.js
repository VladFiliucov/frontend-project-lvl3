import parseResponse from './parseResponse.js';
import 'regenerator-runtime/runtime.js'; // https://github.com/babel/babel/issues/9849#issuecomment-487040428
import * as yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

const schema = yup.object().shape({
  feedUrl: yup.string().required().url().notOneOf(['jimmy', 42]),
});

const validateForm = async () => {
  const result = await schema.isValid(42);
  console.log("asdfadfadfa", result);
}

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

  const form = document.querySelector('#rss-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // validation on submit
    validateForm();
    fetch('https://ru.hexlet.io/lessons.rss')
      .then((response) => response.text())
      .then((str) => (new window.DOMParser()).parseFromString(str, 'text/xml'))
      .then((xmlDoc) => console.log(parseResponse(xmlDoc)));
  });
};

app();
