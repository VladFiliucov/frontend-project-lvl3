import onChange from 'on-change';

const renderErrors = (errors) => {
  const errorMessage = errors[0];
  const input = document.querySelector('input');
  const errorMessageDiv = document.querySelector('.feedback');

  if (errors.length === 0) {
    input.classList.remove('is-invalid');
    errorMessageDiv.innerHTML = '';
    return;
  }

  input.classList.add('is-invalid');
  errorMessageDiv.classList.add('text-success', 'text-danger');
  errorMessageDiv.textContent = errorMessage;
};

const resetForm = () => {
  const form = document.querySelector('#rss-form');
  form.reset();
};

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
  const ul = postsContainer.querySelector('ul');
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

    const a = document.createElement('a');
    a.setAttribute('href', post.postLink);
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('target', '_blank');
    a.classList.add('font-weight-bold');
    a.textContent = post.postTitle;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.textContent = 'Просмотр';

    li.append(a);
    li.append(button);

    ul.appendChild(li);
  });
};

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

  renderNewestPosts(newestFeed.posts.reverse());
};

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrors(value);
      break;
    case 'feeds':
      renderNewestFeed(value);
      resetForm();
      break;
    default:
      break;
  }
});
