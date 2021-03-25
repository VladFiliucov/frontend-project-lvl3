import onChange from 'on-change';

const renderErrors = (errors, text) => {
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
  errorMessageDiv.textContent = text(errorMessage);
};

const resetForm = () => {
  const form = document.querySelector('#rss-form');
  form.reset();
};

const renderLists = (t) => {
  const containers = [
    [t('feeds'), document.querySelector('.feeds')],
    [t('posts'), document.querySelector('.posts')],
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

const renderPosts = (posts, t) => {
  const postsContainer = document.querySelector('.posts');

  const ul = postsContainer.querySelector('ul');
  ul.innerHTML = '';
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

    const a = document.createElement('a');
    a.setAttribute('href', post.postLink);
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('target', '_blank');
    a.dataset.id = post.id;
    a.classList.add('font-weight-bold', post.visited ? 'fw-normal' : 'fw-bold');
    a.textContent = post.postTitle;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.textContent = t('preview');
    button.dataset.id = post.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#activePostModal';

    li.append(a);
    li.append(button);

    ul.appendChild(li);
  });
};

const renderModal = (activePost, t) => {
  if (!activePost) return;

  const title = document.querySelector('#activePostModalLabel');
  title.textContent = activePost.postTitle;
  const description = document.querySelector('.modal-body');
  description.textContent = activePost.postDescription;
  const closeBtn = document.querySelector('#close-btn');
  closeBtn.textContent = t('close');
  const readMoreLink = document.querySelector('#read-more-link');
  readMoreLink.textContent = t('readMore');
  readMoreLink.setAttribute('href', activePost.postLink);
};

const renderNewestFeed = (feeds, t) => {
  const feedContainer = document.querySelector('.feeds');
  if (feeds.length === 1) renderLists(t);

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

export default (state, t) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrors(value, t);
      break;
    case 'feeds':
      renderNewestFeed(value, t);
      resetForm();
      break;
    case 'posts':
      renderPosts(value, t);
      break;
    case 'activePost':
      renderModal(value, t);
      break;
    default:
      break;
  }
});
