import * as yup from 'yup';
import {
  fetchFeed, observeFeedsUpdates, parseResponse,
} from './utils/index.js';
import * as FORM_STATES from './constants/index.js';
import localePromise from './initializers/i18n.js';
import watchState from './view/index.js';
import 'regenerator-runtime/runtime.js'; // https://github.com/babel/babel/issues/9849#issuecomment-487040428
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = (t) => {
  const state = {
    form: {
      status: FORM_STATES.untouched,
      processError: null,
      url: '',
      valid: false,
      errors: [],
    },
    feeds: [],
    posts: [],
    activePost: null,
    visitedPostIds: [],
  };

  yup.setLocale({
    string: {
      url: 'urlInvalid',
    },
    mixed: {
      notOneOf: 'existingRSS',
    },
  });

  const form = document.querySelector('#rss-form');
  const feedback = document.querySelector('div.feedback');
  const submitButton = form.querySelector('button');
  const input = form.querySelector('input');
  const postsNode = document.querySelector('.posts');
  const activePostModal = document.querySelector('#activePostModal');

  const selectors = {
    postsNode,
    formElements: {
      form, submitButton, input, feedback,
    },
  };

  const watchedState = watchState(state, t, selectors);

  observeFeedsUpdates(watchedState);

  const schema = yup.string().required().url();

  const getValidationErrors = (feedUrl) => {
    try {
      schema
        .notOneOf(watchedState.feeds.map((feed) => feed.url))
        .validateSync(feedUrl);
      return [];
    } catch (err) {
      return err.errors;
    }
  };

  activePostModal.addEventListener('hidden.bs.modal', () => {
    watchedState.activePost = null;
  });

  // TODO: check if click events fire on mobile
  postsNode.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
      const activePost = watchedState.posts.find((post) => post.id === e.target.dataset.id);
      watchedState.activePost = activePost;
      watchedState.visitedPostIds.push(activePost.id);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    watchedState.form.errors = getValidationErrors(url);

    if (watchedState.form.errors.length > 0) {
      watchedState.form.status = FORM_STATES.hasErrors;
      return;
    }

    watchedState.form.status = FORM_STATES.submitting;
    fetchFeed(url)
      .catch(() => {
        watchedState.form.errors = ['networkError'];
        watchedState.form.status = FORM_STATES.hasErrors;
      })
      .then((resp) => {
        console.log(resp);
        const { xmlDoc } = resp;
        const parsedFeed = parseResponse(xmlDoc);
        watchedState.feeds.push({ url, ...parsedFeed.feed });
        const newPosts = parsedFeed.posts.map((post) => ({ feedId: url, id: post.link, ...post }));
        watchedState.posts = [...newPosts, ...state.posts];
        watchedState.form.status = FORM_STATES.success;
      })
      .catch(() => {
        watchedState.form.errors = ['parsingError'];
        watchedState.form.status = FORM_STATES.hasErrors;
      });
  });
};

export default () => localePromise.then((text) => {
  app(text);
});
