export const sortPostsByDate = (posts) => posts
  .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

export const parseResponse = (data) => {
  const title = data.getElementsByTagName('title')[0].childNodes[0].nodeValue;
  const description = data.getElementsByTagName('description')[0].childNodes[0].nodeValue;
  const posts = [...data.querySelectorAll('item')].map((item) => {
    const postLink = item.querySelector('link').innerHTML;
    const postTitle = item.querySelector('title').innerHTML;
    const postDescription = item.querySelector('description').innerHTML;
    const pubDate = item.querySelector('pubDate').innerHTML;

    return ({
      postLink,
      postTitle,
      postDescription,
      id: postLink,
      visited: false,
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
    .then((str) => (new window.DOMParser()).parseFromString(str.contents, 'text/xml'))
    .then((data) => ({ url, xmlDoc: data }))
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
