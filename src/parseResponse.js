export default (data) => {
  const title = data.getElementsByTagName('title')[0].childNodes[0].nodeValue;
  const description = data.getElementsByTagName('description')[0].childNodes[0].nodeValue;

  return {
    title,
    description,
  };
};
