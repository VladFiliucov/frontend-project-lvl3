import axios from 'axios';

const constructURL = (url) => {
  const fullURL = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  fullURL.searchParams.set('url', url);
  fullURL.searchParams.set('disableCache', true);

  return fullURL.toString();
};

const fetchFeed = (url) => (
  axios.get(constructURL(url)).then(({ data }) => ({ url, data }))
);

export default fetchFeed;
