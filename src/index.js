import * as yup from 'yup';
import i18next from 'i18next';
import differenceWith from 'lodash/differenceWith.js';
import isEqual from 'lodash/isEqual.js';
import fetchFeed from './utils/index.js';
import localisationConfig from './initializers/i18n.js';
import watchState from './view/index.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const parseFeed = (rawFeed) => {
  const xmlDoc = (new DOMParser()).parseFromString(rawFeed, 'text/xml');
  const parserError = xmlDoc.querySelector('parsererror');

  if (parserError) {
    throw new Error(`Parsing error: ${parserError.textContent}`);
  }

  const title = xmlDoc.querySelector('channel > title').textContent;
  const description = xmlDoc.querySelector('channel > description').textContent;
  const posts = [...xmlDoc.querySelectorAll('item')].map((item) => {
    const postLink = item.querySelector('link').textContent;
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;

    return ({
      link: postLink,
      title: postTitle,
      description: postDescription,
    });
  });

  return {
    feed: {
      title,
      description,
    },
    posts,
  };
};

const renewFeed = (feedURL, watchedState) => fetchFeed(feedURL)
  .then(({ data }) => {
    const parsedFeed = parseFeed(data.contents);
    const savedPosts = watchedState.posts.filter((post) => post.feedId === feedURL);
    const latestPosts = parsedFeed
      .posts.map((post) => ({ feedId: feedURL, id: post.link, ...post }));

    const newPosts = differenceWith(latestPosts, savedPosts, isEqual);
    newPosts.forEach((newPost) => watchedState.posts.unshift(newPost));
  })
  .catch(() => {
    console.error("Couldn't renew feed for", feedURL);
  });

export const observeFeedsUpdates = (watchedState) => {
  const promises = watchedState.feeds.map((feed) => renewFeed(feed.url, watchedState));
  const refreshInterval = 5000;

  Promise.allSettled(promises)
    .then(() => setTimeout(() => observeFeedsUpdates(watchedState), refreshInterval));
};


const app = (t) => {
  const state = {
    form: {
      url: '',
      valid: true,
      errors: [],
    },
    feeds: [],
    posts: [],
    activePost: null,
    visitedPostIds: [],
    processing: {
      status: 'idle',
      errors: [],
    },
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

  const DOMNodes = {
    postsNode,
    formElements: {
      form, submitButton, input, feedback,
    },
  };

  const watchedState = watchState(state, t, DOMNodes);

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

  postsNode.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
      const activePost = watchedState.posts.find((post) => post.id === e.target.dataset.id);
      watchedState.activePost = activePost;
      watchedState.visitedPostIds.push(activePost.id);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.processing.status = 'inProgress';
    const formData = new FormData(event.target);
    const url = formData.get('url');
    watchedState.form.errors = getValidationErrors(url);

    if (watchedState.form.errors.length > 0) {
      watchedState.form.valid = false;
      watchedState.processing.status = 'idle';
      return;
    }

    watchedState.form.valid = true;

    fetchFeed(url)
      .then(({ data }) => {
        const parsedFeed = parseFeed(data.contents);
        watchedState.feeds.push({ url, ...parsedFeed.feed });
        const newPosts = parsedFeed.posts.map((post) => ({ feedId: url, id: post.link, ...post }));
        watchedState.posts = [...newPosts, ...state.posts];
        watchedState.processing.errors = [];
        watchedState.processing.status = 'success';
      })
      .catch((error) => {
        if (error.isAxiosError) {
          watchedState.processing.errors = ['networkError'];
        } else {
          watchedState.processing.errors = ['parsingError'];
        }
        watchedState.processing.status = 'hasError';
      });
  });

  observeFeedsUpdates(watchedState);
};

export default () => {
  const i18n = i18next.createInstance();

  return i18n.init(localisationConfig).then(() => app(i18n));
};
