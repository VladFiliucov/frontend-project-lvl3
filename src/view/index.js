import onChange from 'on-change';

const renderErrors = () => console.log('rendering errors');

const renderLists = () => {
  const containers = [
    ['Фиды', document.querySelector('.feeds')],
    ['Посты', document.querySelector('.posts')],
  ];
  containers.forEach(([name, container]) => {
    const heading = document.createElement('h2');
    heading.textContent = name;
    container.appendChild(heading);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'mb-5');
    container.appendChild(ul);
  });
};

const renderNewestPosts = (posts) => {
  const postsContainer = document.querySelector('.posts');
}

const renderNewestFeed = (feeds) => {
  const feedContainer = document.querySelector('.feeds');
  if (feeds.length === 1) renderLists();

  const newestFeed = feeds[feeds.length - 1];
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  const currentList = feedContainer.querySelector('ul');
  const h3 = document.createElement('h3');
  h3.textContent = newestFeed.title;
  const p = document.createElement('p');
  p.textContent = newestFeed.description;
  li.append(h3);
  li.append(p);
  currentList.appendChild(li);
};

const fieldElements = 1;

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrors(fieldElements, value);
      break;
    case 'feeds':
      renderNewestFeed(value);
      break;
    default:
      break;
  }
});
