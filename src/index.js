import 'bootstrap/dist/css/bootstrap.min.css';

console.log('this file is loaded');

const app = () => {
  const form = document.querySelector('#rss-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Submitting form called');
  });
};

app();
