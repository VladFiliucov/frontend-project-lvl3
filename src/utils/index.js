import differenceWith from 'lodash/differenceWith.js';
import isEqual from 'lodash/isEqual.js';

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

export const fetchFeed = (url) => (
  fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => response.json())
    .then((str) => ({ url, xmlDoc: (new window.DOMParser()).parseFromString(str.contents, 'text/xml') }))
);

export const observeFeedsUpdates = (watchedState) => {
  setTimeout(() => {
    const promises = watchedState.feeds.map((feed) => fetchFeed(feed.url));

    Promise.allSettled(promises)
      .then((results) => results.forEach(({ value, status }) => {
        if (status === 'rejected') return;

        const { url, xmlDoc } = value;

        let parsedFeed;
        try {
          parsedFeed = parseResponse(xmlDoc);
        } catch {
          return;
        }

        const savedPosts = watchedState.posts.filter((post) => post.feedId === url);
        const latestPosts = parsedFeed
          .posts
          .map((post) => ({ feedId: url, id: post.link, ...post }));

        const newPosts = differenceWith(savedPosts, latestPosts, isEqual);
        watchedState.posts.push([...newPosts]);
      }))
      .then(() => observeFeedsUpdates(watchedState));
  }, 5000);
};
