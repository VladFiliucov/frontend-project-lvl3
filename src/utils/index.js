export const sortPostsByDate = (posts) => posts
  .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

export const parseResponse = (data) => {
  const title = data.querySelector('channel > title').textContent;
  const description = data.querySelector('channel > description').textContent;
  const posts = [...data.querySelectorAll('item')].map((item) => {
    const postLink = item.querySelector('link').textContent;
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const pubDate = item.querySelector('pubDate').textContent;

    return ({
      postLink,
      postTitle,
      postDescription,
      id: postLink,
      pubDate: new Date(pubDate),
    });
  });

  return {
    feed: {
      title,
      description,
    },
    posts: sortPostsByDate(posts),
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
      .then((results) => results.forEach((result) => {
        const { url, xmlDoc } = result.value;
        const parsedFeed = parseResponse(xmlDoc);

        const latestPostPubDate = new Date(
          sortPostsByDate(watchedState.posts).find((post) => post.feedId === url).pubDate,
        );
        const newPosts = parsedFeed
          .posts
          .filter((post) => (post.pubDate.valueOf() - latestPostPubDate.valueOf()) > 0);

        if (newPosts.length) {
          watchedState.posts.push(newPosts.map((post) => ({ feedId: url, ...post })));
        }
      }))
      .then(() => observeFeedsUpdates(watchedState));
  }, 5000);
};
