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

export const observeFeedsUpdates = (feeds) => {
  setTimeout(() => {
    console.log(feeds);
    // Вызвать еще раз себя в конце, что-б имитировать setInterval?
  }, 5000);
};

export const fetchFeed = (url) => (
  fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => response.json())
    .then((str) => (new window.DOMParser()).parseFromString(str.contents, 'text/xml'))
);
