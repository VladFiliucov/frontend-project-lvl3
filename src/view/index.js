import onChange from 'on-change';

const renderFeedback = (feedbackType, text, feedback, errors) => {
  /* eslint-disable no-param-reassign */
  const shouldClearFeedback = !['success', 'error'].includes(feedbackType);

  if (shouldClearFeedback) {
    feedback.innerHTML = '';
    return;
  }

  if (feedbackType === 'success') {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = text('success');
    return;
  }

  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = text(errors[0]);
  /* eslint-enable no-param-reassign */
};

const renderFormErrors = (errors, text, { input, feedback }) => {
  if (errors.length === 0) {
    input.classList.remove('is-invalid');
    renderFeedback('success', text, feedback);
    return;
  }
  input.classList.add('is-invalid');
  renderFeedback('error', text, feedback, errors);
};

const toggleInteraction = (processing, { submitButton, input }) => {
  if (processing) {
    submitButton.setAttribute('disabled', true);
    input.setAttribute('readOnly', true);
  } else {
    submitButton.removeAttribute('disabled');
    input.removeAttribute('readOnly');
  }
};

const resetForm = ({ form }) => form.reset();

const renderProcessing = ({ status, errors }, text, formElements) => {
  switch (status) {
    case 'idle':
      toggleInteraction(false, formElements);
      break;
    case 'inProgress':
      toggleInteraction(true, formElements);
      break;
    case 'hasError':
      renderFeedback('error', text, formElements.feedback, errors);
      toggleInteraction(false, formElements);
      break;
    case 'success':
      renderFeedback('success', text, formElements.feedback);
      resetForm(formElements);
      toggleInteraction(false, formElements);
      break;
    default:
      throw new Error(`form status ${status} not handled`);
  }
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

const renderPosts = (posts, t, visitedPostsIds) => {
  const postsContainer = document.querySelector('.posts');

  const ul = postsContainer.querySelector('ul');
  ul.innerHTML = '';
  posts.forEach((post) => {
    const isVisited = visitedPostsIds.includes(post.id);
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('target', '_blank');
    a.dataset.id = post.id;
    // Boostrap 5 classes for production
    a.classList.add(isVisited ? 'fw-normal' : 'fw-bold');
    // Classes for tests
    a.classList.add(isVisited ? 'font-weight-normal' : 'font-weight-bold');
    a.textContent = post.title;

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
  title.textContent = activePost.title;
  const description = document.querySelector('.modal-body');
  description.textContent = activePost.description;
  const closeBtn = document.querySelector('#close-btn');
  closeBtn.textContent = t('close');
  const readMoreLink = document.querySelector('#read-more-link');
  readMoreLink.textContent = t('readMore');
  readMoreLink.setAttribute('href', activePost.link);
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

export default (state, i18nInstance, DOMNodes) => onChange(state, (path, value) => {
  const t = i18nInstance.t.bind(i18nInstance);
  switch (path) {
    case 'processing.status':
      renderProcessing(state.processing, t, DOMNodes.formElements);
      break;
    case 'form.valid':
      renderFormErrors(state.form.errors, t, DOMNodes.formElements);
      break;
    case 'feeds':
      renderNewestFeed(value, t);
      break;
    case 'posts':
      renderPosts(value, t, state.visitedPostIds);
      break;
    case 'visitedPostIds':
      renderPosts(state.posts, t, value);
      break;
    case 'activePost':
      renderModal(value, t);
      break;
    default:
      break;
  }
});
