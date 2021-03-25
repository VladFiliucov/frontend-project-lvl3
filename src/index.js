import * as yup from 'yup';
import {
  fetchFeed, observeFeedsUpdates, parseResponse,
} from './utils/index.js';
import localePromise from './initializers/i18n.js';
import watchState from './view/index.js';
import 'regenerator-runtime/runtime.js'; // https://github.com/babel/babel/issues/9849#issuecomment-487040428
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
    posts: [],
    activePost: null,
  };

  yup.setLocale({
    string: {
      url: 'urlInvalid',
    },
    mixed: {
      notOneOf: 'existingRSS',
    },
  });

  const watchedState = watchState(state, t);

  observeFeedsUpdates(watchedState);

  const schema = yup.string().required().url();

  const validateURL = (feedUrl) => schema
    .notOneOf(watchedState.feeds.map((feed) => feed.url))
    .validate(feedUrl);

  const form = document.querySelector('#rss-form');
  const postsNode = document.querySelector('.posts');

  document.querySelector('#activePostModal').addEventListener('hidden.bs.modal', () => {
    const { activePost } = watchedState;
    const activePostIndex = watchedState.posts.findIndex((post) => post.id === activePost.id);
    watchedState.posts.splice(activePostIndex, 1, { ...activePost, visited: true });
    watchedState.activePost = null;
  });

  // TODO: check if click events fire on mobile
  postsNode.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
      const activePost = watchedState.posts.find((post) => post.id === e.target.dataset.id);
      watchedState.activePost = activePost;
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    validateURL(url)
      .then(() => {
        watchedState.form.errors = [];
        fetchFeed(url)
          .then(({ xmlDoc }) => {
            const parsedFeed = parseResponse(xmlDoc);
            watchedState.feeds.push({ url, ...parsedFeed.feed });
            const newPosts = parsedFeed.posts.map((post) => ({ feedId: url, ...post }));
            watchedState.posts = [...newPosts, ...state.posts];
          })
          .catch(() => {
            watchedState.form.errors = [t('networkError')];
          });
      })
      .catch((err) => {
        watchedState.form.errors = err.errors;
      });
  });
};

localePromise.then((text) => {
  app(text);
});
