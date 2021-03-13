import onChange from 'on-change';

const renderErrors = () => console.log('rendering errors');

const renderPosts = () => console.log('rendering posts');

const renderNewestFeed = (feeds) => {
  const newestFeed = feeds[feeds.length - 1];
  console.log(newestFeed);
  const div = document.createElement('div');
  div.id = newestFeed.url;
  div.textContent = newestFeed.url;
  const feedContainer = document.querySelector('.feeds');
  feedContainer.appendChild(div);
};

const fieldElements = 1;

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrors(fieldElements, value);
      break;
    case 'feeds':
      renderNewestFeed(value);
      break;
    default:
      break;
  }
});
