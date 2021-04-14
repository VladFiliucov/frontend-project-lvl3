export default (rawFeed) => {
  const xmlDoc = (new DOMParser()).parseFromString(rawFeed, 'text/xml');
  const parserError = xmlDoc.querySelector('parsererror');

  if (parserError) {
    const parsingError = new Error(`Parsing error: ${parserError.textContent}`);
    parsingError.isParsingError = true;

    throw parsingError;
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
