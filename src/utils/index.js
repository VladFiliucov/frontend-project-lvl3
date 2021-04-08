import differenceWith from 'lodash/differenceWith.js';
import isEqual from 'lodash/isEqual.js';
import axios from 'axios';

export const parseFeed = (rawFeed) => {
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

const constructURL = (url) => {
  const fullURL = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  fullURL.searchParams.set('url', url);
  fullURL.searchParams.set('disableCache', true);

  return fullURL.toString();
};

export const fetchFeed = (url) => (
  axios.get(constructURL(url)).then(({ data }) => ({ url, data }))
);

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
