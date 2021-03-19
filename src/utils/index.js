export const parseResponse = (data) => {
  const title = data.getElementsByTagName('title')[0].childNodes[0].nodeValue;
  const description = data.getElementsByTagName('description')[0].childNodes[0].nodeValue;
  const posts = [...data.querySelectorAll('item')].map((item) => ({
    postLink: item.querySelector('link').innerHTML,
    postTitle: item.querySelector('title').innerHTML,
    postDescription: item.querySelector('description').innerHTML,
  }));

  return {
    title,
    description,
    posts,
  };
};

export const fetchFeed = (url) => (
  fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => response.json())
    .then((str) => (new window.DOMParser()).parseFromString(str.contents, 'text/xml'))
);

const fetchAndCompareFeeds = (feeds) => {
  // get all feeds
  const promises = feeds.map((feed) => {
    return fetchFeed(feed.url)
  })
  console.log(promises);
  // fetch each feed
  // use promise all settled
  // compare posts in fetched feed with original one
  // update prosts that where not rejected and that have new posts
  // ?set a new timeout maybe here?
  //
  // const promise1 = Promise.resolve(3);
  // const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
  // const promises = [promise1, promise2];

  // Promise.allSettled(promises).
  //   then((results) => results.forEach((result) => console.log(result.status)));
};

export const observeFeedsUpdates = (feeds) => {
  setTimeout(() => {
    console.log("In observer");
    fetchAndCompareFeeds(feeds);
    // Вызвать еще раз себя в конце, что-б имитировать setInterval?
  }, 5000);
};

// fetchFeed(url)
//   .then((xmlDoc) => {
//     const parsedFeed = parseResponse(xmlDoc);
//     watchedState.feeds.push({ url, ...parsedFeed });
//   })
//   .catch(() => {
//     watchedState.form.errors = [t('networkError')];
//   });
