import differenceWith from 'lodash/differenceWith.js';
import isEqual from 'lodash/isEqual.js';
import axios from 'axios';

export const parseResponse = (data) => {
  const parserError = document.querySelector('parsererror');

  if (parserError) {
    throw new Error(`Parsing error: ${parserError.textContent}`);
  }

  const title = data.querySelector('channel > title').textContent;
  const description = data.querySelector('channel > description').textContent;
  const posts = [...data.querySelectorAll('item')].map((item) => {
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

const constructURL = (url) => {
  const fullURL = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  fullURL.searchParams.set('url', url);
  fullURL.searchParams.set('disableCache', true);

  return fullURL;
};

export const fetchFeed = (url) => (
  axios.get(constructURL(url).toString())
    .then(({ data }) => ({ url, xmlDoc: (new DOMParser()).parseFromString(data.contents, 'text/xml') }))
);

export const observeFeedsUpdates = (watchedState) => {
  setTimeout(() => {
    const promises = watchedState.feeds.map((feed) => fetchFeed(feed.url));

    Promise.allSettled(promises)
      .then((results) => results.forEach(({ value, status }) => {
        if (status === 'rejected') return;

        const { url, xmlDoc } = value;

        try {
          parseResponse(xmlDoc);
        } catch {
          return;
        }
        const parsedFeed = parseResponse(xmlDoc);

        const savedPosts = watchedState.posts.filter((post) => post.feedId === url);
        const latestPosts = parsedFeed
          .posts
          .map((post) => ({ feedId: url, id: post.link, ...post }));

        const newPosts = differenceWith(savedPosts, latestPosts, isEqual);

        if (newPosts.length > 0) watchedState.posts.push([...newPosts]);
      }))
      .then(() => observeFeedsUpdates(watchedState));
  }, 5000);
};
