export const observeFeedsUpdates = (feeds) => {
  setTimeout(() => {
    console.log(feeds);
    // Вызвать еще раз себя в конце, что-б имитировать setInterval?
  }, 5000)
};

export const fetchFeed = (url) => (
  fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => response.json())
    .then((str) => (new window.DOMParser()).parseFromString(str.contents, 'text/xml'))
);
