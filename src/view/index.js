import onChange from 'on-change';
import * as FORM_STATES from '../constants/index.js';

const renderErrors = (errors, text, { input, feedback }) => {
  const errorMessage = errors[0];
  const errorMessageDiv = feedback;

  if (errors.length === 0) {
    input.classList.remove('is-invalid');
    errorMessageDiv.innerHTML = '';
    return;
  }

  input.classList.add('is-invalid');
  errorMessageDiv.classList.remove('text-success');
  errorMessageDiv.classList.add('text-danger');
  errorMessageDiv.textContent = text(errorMessage);
};

const enableInteraction = ({ submitButton, input }) => {
  submitButton.removeAttribute('disabled');
  input.removeAttribute('readOnly');
};

const disableInteraction = ({ submitButton, input }) => {
  submitButton.setAttribute('disabled', true);
  input.setAttribute('readOnly', true);
};

const resetForm = ({ form, submitButton, input }) => {
  enableInteraction({ input, submitButton });
  form.reset();
};

const showSuccessFlash = (feedbackElement, text) => {
  const successMessageDiv = feedbackElement;
  successMessageDiv.classList.remove('text-danger');
  successMessageDiv.classList.add('text-success');

  successMessageDiv.innerHTML = text('success');
};

const renderForm = (formState, text, formElements) => {
  const { status, errors } = formState;

  switch (status) {
    case FORM_STATES.untouched:
      resetForm(formElements);
      break;
    case FORM_STATES.hasErrors:
      renderErrors(errors, text, formElements);
      enableInteraction(formElements);
      break;
    case FORM_STATES.submitting:
      renderErrors(errors, text, formElements);
      disableInteraction(formElements);
      break;
    case FORM_STATES.success:
      resetForm(formElements);
      showSuccessFlash(formElements.feedback, text);
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
    a.classList.add(isVisited ? 'fw-normal' : 'fw-bold');
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

export default (state, t, selectors) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.status':
      renderForm(state.form, t, selectors.formElements);
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
