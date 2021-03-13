export default (data) => {
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
